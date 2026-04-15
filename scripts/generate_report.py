#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_report.py — Daily Macro Market Briefing JSON Generator

Fetches live data from Yahoo Finance, CNN Fear & Greed, and RSS feeds,
then outputs a JSON file matching the Next.js ReportData TypeScript interface.

Usage:
    python scripts/generate_report.py              # writes public/data/report.json
    python scripts/generate_report.py --output /path/to/file.json

Environment variables (optional):
    DEEPSEEK_API_KEY   — enables DeepSeek AI for Chinese news translation/analysis
"""

import json
import os
import sys
import math
import time
import warnings
import argparse
import re
from datetime import datetime, timedelta
from pathlib import Path

import yfinance as yf
import pandas as pd
import numpy as np
import requests
import feedparser

warnings.filterwarnings('ignore')

# ============================================================
# TIMEZONE & DATES
# ============================================================

import zoneinfo
_TZ_TPE = zoneinfo.ZoneInfo('Asia/Taipei')
NOW = datetime.now(_TZ_TPE).replace(tzinfo=None)
TODAY_STR = NOW.strftime('%Y-%m-%d')
REPORT_TIME = NOW.strftime('%Y-%m-%d %H:%M')
YEAR_START = datetime(NOW.year, 1, 1)

# ============================================================
# TICKER DEFINITIONS (same as old project)
# ============================================================

HERO_TICKERS = [
    ('^GSPC',    'S&P 500'),
    ('^IXIC',    '納斯達克'),
    ('^DJI',     '道瓊斯'),
    ('^N225',    '日經225'),
    ('GC=F',     '黃金'),
    ('CL=F',     'WTI 原油'),
    ('DX-Y.NYB', '美元指數'),
    ('BTC-USD',  'Bitcoin'),
]

ASIAN_INDICES = [
    ('^N225',    '日經225'),
    ('^TWII',    '台灣加權'),
    ('^HSI',     '香港恆生'),
    ('000001.SS','上證綜指'),
    ('399001.SZ','深證成指'),
    ('^KS11',    '韓國KOSPI'),
    ('^AXJO',    '澳洲ASX200'),
]
EMERGING_INDICES = [
    ('^BSESN',  '印度SENSEX'),
    ('^NSEI',   '印度NIFTY50'),
    ('^JKSE',   '印尼雅加達綜合'),
    ('^SET.BK', '泰國SET'),
    ('^KLSE',   '馬來西亞KLCI'),
    ('PSEI.PS', '菲律賓PSEi'),
]
EUROPEAN_INDICES = [
    ('^GDAXI',   '德國DAX'),
    ('^FTSE',    '英國FTSE100'),
    ('^FCHI',    '法國CAC40'),
    ('^STOXX50E','歐洲STOXX50'),
    ('^SSMI',    '瑞士SMI'),
]
US_INDICES = [
    ('^GSPC', 'S&P 500'),
    ('^IXIC', '納斯達克'),
    ('^DJI',  '道瓊斯'),
    ('^RUT',  '羅素2000'),
    ('^SOX',  '費城半導體'),
]
COMMODITIES = [
    ('GC=F', '黃金'),
    ('SI=F', '白銀'),
    ('CL=F', '原油(WTI)'),
    ('BZ=F', '布蘭特原油'),
    ('HG=F', '銅'),
    ('NG=F', '天然氣'),
]
FOREX = [
    ('DX-Y.NYB', '美元指數'),
    ('EURUSD=X', 'EUR/USD'),
    ('USDJPY=X', 'USD/JPY'),
    ('GBPUSD=X', 'GBP/USD'),
    ('CNY=X',    'USD/CNY'),
    ('TWD=X',    'USD/TWD'),
]
BONDS = [
    ('^IRX', '美國3月期',  0.25),
    ('^FVX', '美國5年期',  5),
    ('^TNX', '美國10年期', 10),
    ('^TYX', '美國30年期', 30),
]
CRYPTO = [
    ('BTC-USD',  'Bitcoin',  'BTC'),
    ('ETH-USD',  'Ethereum', 'ETH'),
    ('BNB-USD',  'BNB',      'BNB'),
    ('SOL-USD',  'Solana',   'SOL'),
    ('XRP-USD',  'XRP',      'XRP'),
    ('ADA-USD',  'Cardano',  'ADA'),
    ('DOGE-USD', 'Dogecoin', 'DOGE'),
]
COUNTRY_ETFS = [
    ('SPY','美國'), ('VGK','歐洲'), ('EWJ','日本'), ('FXI','中國/港股'),
    ('EWT','台灣'), ('EWY','韓國'), ('INDA','印度'), ('VWO','新興市場'),
    ('EIDO','印尼'), ('VNM','越南'), ('THD','泰國'), ('EWM','馬來西亞'),
    ('EPHE','菲律賓'), ('EWA','澳洲'),
]
SECTOR_ETFS = [
    ('XLK','資訊科技'), ('XLU','公用事業'), ('XLF','金融'), ('XLI','工業'),
    ('XLE','能源'), ('XLY','非必需消費'), ('XLC','通訊服務'), ('XLRE','房地產'),
    ('XLB','原材料'), ('XLV','醫療保健'), ('XLP','必需消費'),
]
BOND_ETFS = [
    ('SHY','1-3年國債'), ('IEI','3-7年國債'), ('IEF','7-10年國債'),
    ('TLH','10-20年國債'), ('TLT','20年+國債'), ('LQD','投資級債'),
    ('HYG','非投資等債'), ('EMB','新興債'), ('VWOB','新興美元債'), ('EMLC','新興本地債'),
]
US_WATCHLIST = [
    ('AAPL','Apple'), ('MSFT','Microsoft'), ('NVDA','NVIDIA'), ('AMD','AMD'),
    ('TSLA','Tesla'), ('AMZN','Amazon'), ('GOOGL','Alphabet'), ('META','Meta'),
    ('NFLX','Netflix'), ('ARM','Arm Holdings'), ('SMCI','Supermicro'),
    ('HPE','Hewlett Packard'), ('AVGO','Broadcom'), ('QCOM','Qualcomm'),
    ('MU','Micron'), ('INTC','Intel'), ('JPM','JPMorgan'), ('BAC','Bank of America'),
    ('GS','Goldman Sachs'), ('MS','Morgan Stanley'), ('XOM','ExxonMobil'),
    ('CVX','Chevron'), ('BA','Boeing'), ('LMT','Lockheed Martin'),
    ('JBLU','JetBlue'), ('DAL','Delta Air'), ('UAL','United Airlines'),
    ('LEN','Lennar'), ('DHI','D.R. Horton'), ('Z','Zillow'),
    ('PDD','PDD Holdings'), ('VRSN','Verisign'), ('PAYX','Paychex'),
    ('GNRC','Generac'), ('COIN','Coinbase'), ('LLY','Eli Lilly'),
    ('NEE','NextEra Energy'), ('SPCE','Virgin Galactic'),
]

# ============================================================
# NEWS
# ============================================================

RSS_FEEDS = [
    ('Reuters',     'https://feeds.reuters.com/reuters/businessNews'),
    ('MarketWatch', 'https://feeds.content.dowjones.io/public/rss/mw_marketpulse'),
    ('Yahoo Finance','https://feeds.finance.yahoo.com/rss/2.0/headline?s=%5EGSPC&region=US&lang=en-US'),
    ('Investing.com','https://www.investing.com/rss/news_301.rss'),
    ('CNBC',        'https://feeds.nbcnews.com/nbcnews/public/business'),
]

HIGH_KW = ['fed','fomc','interest rate','rate decision','gdp','inflation','cpi','pce',
           'trade war','tariff','war ','attack','default','recession','crash',
           'sanctions','nuclear','emergency','crisis','federal reserve']
MID_KW  = ['earnings','ipo','acquisition','merger','bankruptcy','layoff','jobs',
            'unemployment','housing','china','oil','opec','gold','bitcoin',
            'rate hike','rate cut','stimulus','budget','deficit','debt ceiling']
BULL_KW = ['rises','rally','rallies','surges','jumps','beats','exceeds','strong',
           'growth','record high','gains','upgrades','boosts','recovery','positive',
           'higher','increases','expanded','profits','outperforms']
BEAR_KW = ['falls','drops','plunges','misses','weak','decline','lower','concern',
           'worry','fears','cuts','losses','downgrades','recession','crash',
           'negative','decreases','contracts','layoffs','defaults','slumps']
GLOBAL_KW = ['china','europe','global','world','international','opec','imf',
              'g7','g20','japan','euro','uk ','asia','emerging market']

# ============================================================
# UTILITY FUNCTIONS
# ============================================================

def safe_float(v, default=0.0):
    if v is None or (isinstance(v, float) and (np.isnan(v) or np.isinf(v))):
        return default
    return float(v)


def arrow_trend(pct):
    if pct is None or (isinstance(pct, float) and np.isnan(pct)):
        return 'neutral'
    if pct > 2:  return 'strong_up'
    if pct > 0:  return 'up'
    if pct < -2: return 'strong_down'
    if pct < 0:  return 'down'
    return 'neutral'


def fmt_flow(v):
    if v is None or (isinstance(v, float) and np.isnan(v)):
        return 'N/A'
    a = abs(v)
    if a >= 1e9:  return f'{v/1e8:+.1f}億'
    if a >= 1e8:  return f'{v/1e8:+.2f}億'
    if a >= 1e6:  return f'{v/1e4:+.0f}萬'
    if a >= 1e4:  return f'{v/1e4:+.1f}萬'
    return f'{v:+.0f}'


def flow_direction(v):
    if v is None or (isinstance(v, float) and np.isnan(v)):
        return 'up'
    return 'up' if v >= 0 else 'down'


def calc_daily_money_flow(df):
    hl = (df['High'] - df['Low']).values
    close = df['Close'].values
    low   = df['Low'].values
    high  = df['High'].values
    vol   = df['Volume'].values
    mfm = np.where(hl > 0, ((close - low) - (high - close)) / hl, 0.0)
    return pd.Series(mfm * vol * close, index=df.index)

# ============================================================
# DATA FETCHING
# ============================================================

def _download_single(sym, days):
    """Download a single symbol individually (fallback)."""
    start = (NOW - timedelta(days=days)).strftime('%Y-%m-%d')
    end   = NOW.strftime('%Y-%m-%d')
    try:
        df = yf.download(sym, start=start, end=end, interval='1d',
                         auto_adjust=True, progress=False)
        if df is not None and not df.empty:
            df = df.dropna(how='all')
            if not df.empty:
                return df
    except Exception:
        pass
    return None


def _download_batch(symbols, days):
    """Download a batch of symbols."""
    result = {}
    if not symbols:
        return result
    start = (NOW - timedelta(days=days)).strftime('%Y-%m-%d')
    end   = NOW.strftime('%Y-%m-%d')
    try:
        raw = yf.download(symbols, start=start, end=end, interval='1d',
                          group_by='ticker', auto_adjust=True, progress=False, threads=True)
    except Exception as e:
        print(f'  [batch download error] {e}')
        return result
    single = (len(symbols) == 1)
    for sym in symbols:
        try:
            df = raw if single else raw[sym]
            df = df.dropna(how='all')
            if not df.empty:
                result[sym] = df
        except Exception:
            pass
    return result


def bulk_download(symbols, days=400, batch_size=15):
    """Download symbols in batches, retry failed ones individually."""
    result = {}
    if not symbols:
        return result

    # Phase 1: batch download
    for i in range(0, len(symbols), batch_size):
        batch = symbols[i:i+batch_size]
        print(f'    batch {i//batch_size + 1}: {len(batch)} symbols...')
        result.update(_download_batch(batch, days))
        time.sleep(0.5)

    # Phase 2: retry failed symbols individually
    failed = [s for s in symbols if s not in result]
    if failed:
        print(f'    retrying {len(failed)} failed symbols individually...')
        for sym in failed:
            time.sleep(0.3)
            df = _download_single(sym, days)
            if df is not None:
                result[sym] = df
                print(f'      [OK] {sym}')
            else:
                print(f'      [FAIL] {sym}')

    ok = len([s for s in symbols if s in result])
    print(f'    result: {ok}/{len(symbols)} symbols downloaded')
    return result


def get_quote(sym, cache):
    df = cache.get(sym)
    if df is None or df.empty:
        return None
    try:
        close = df['Close'].dropna()
        if len(close) < 2:
            return None
        cur  = float(close.iloc[-1])
        prev = float(close.iloc[-2])
        chg  = cur - prev
        pct  = (chg / prev) * 100 if prev else 0
        ytd  = close[close.index >= YEAR_START]
        ytd_pct = ((cur / float(ytd.iloc[0])) - 1) * 100 if len(ytd) > 0 else 0.0
        return {'price': cur, 'prev': prev, 'chg': chg, 'pct': pct, 'ytd': ytd_pct}
    except Exception:
        return None


def get_sparkline(sym, cache, days=30):
    """Get last N days of close prices for sparkline."""
    df = cache.get(sym)
    if df is None or df.empty:
        return []
    close = df['Close'].dropna().tail(days)
    return [round(float(v), 2) for v in close.values]


def calc_etf_flow(sym, cache):
    df = cache.get(sym)
    if df is None or df.empty:
        return None
    df = df[df['Close'].notna()].copy()
    if len(df) < 25:
        return None
    try:
        mf = calc_daily_money_flow(df)
        n  = len(mf)
        daily   = float(mf.iloc[-1])
        weekly  = float(mf.iloc[max(-5,  -n):].sum())
        monthly = float(mf.iloc[max(-21, -n):].sum())
        ytd_total = float(mf[mf.index >= YEAR_START].sum())
        return {'daily': daily, 'weekly': weekly, 'monthly': monthly, 'ytd': ytd_total}
    except Exception:
        return None


def fetch_fear_greed():
    try:
        r = requests.get(
            'https://production.dataviz.cnn.io/index/fearandgreed/graphdata',
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Referer': 'https://edition.cnn.com/markets/fear-and-greed',
                'Origin': 'https://edition.cnn.com',
            },
            timeout=10)
        if r.status_code == 200:
            d = r.json()['fear_and_greed']
            def sr(k):
                v = d.get(k)
                return round(float(v), 1) if v is not None else 0.0
            rating = d.get('rating', '')
            label_map = {
                'Extreme Fear': '極度恐懼', 'Fear': '恐懼', 'Neutral': '中性',
                'Greed': '貪婪', 'Extreme Greed': '極度貪婪',
            }
            return {
                'current': sr('score'),
                'previous': sr('previous_close'),
                'weekAgo': sr('previous_1_week'),
                'monthAgo': sr('previous_1_month'),
                'yearAgo': sr('previous_1_year'),
                'label': label_map.get(rating, rating),
            }
    except Exception as e:
        print(f'  [Fear & Greed error] {e}')
    return {
        'current': 50.0, 'previous': 50.0, 'weekAgo': 50.0,
        'monthAgo': 50.0, 'yearAgo': 50.0, 'label': '中性',
    }


# ============================================================
# NEWS FUNCTIONS
# ============================================================

def classify_news(title, summary=''):
    text = (title + ' ' + summary).lower()
    impact = 'high' if any(k in text for k in HIGH_KW) else \
             'mid' if any(k in text for k in MID_KW) else 'low'
    bull = sum(1 for k in BULL_KW if k in text)
    bear = sum(1 for k in BEAR_KW if k in text)
    sentiment = 'bull' if bull > bear else 'bear' if bear > bull else 'neutral'
    scope = '全球' if any(k in text for k in GLOBAL_KW) else '美國'
    return {'impact': impact, 'sentiment': sentiment, 'region': scope}


def _parse_yf_item(n):
    content = n.get('content', {}) or {}
    title   = content.get('title') or n.get('title', '')
    summary = content.get('summary') or n.get('summary', '')
    canonical = content.get('canonicalUrl') or {}
    link = canonical.get('url', '') if isinstance(canonical, dict) else n.get('link', '#')
    if not link:
        link = '#'
    provider = content.get('provider') or {}
    publisher = provider.get('displayName', 'Yahoo Finance') if isinstance(provider, dict) else \
                n.get('publisher', 'Yahoo Finance')
    pub_date = content.get('pubDate', '') or ''
    try:
        pub_time = datetime.strptime(pub_date, '%Y-%m-%dT%H:%M:%SZ').strftime('%m-%d %H:%M')
    except Exception:
        ts = n.get('providerPublishTime', 0)
        pub_time = datetime.fromtimestamp(ts).strftime('%m-%d %H:%M') if ts else ''
    return {'title': title, 'summary': summary[:300],
            'publisher': publisher, 'link': link, 'time': pub_time}


def fetch_news_yfinance():
    items, seen = [], set()
    for sym in ['^GSPC', '^IXIC', '^DJI', 'SPY', 'QQQ', 'GLD', 'USO', 'BTC-USD']:
        try:
            for n in (yf.Ticker(sym).news or [])[:5]:
                item = _parse_yf_item(n)
                if item['title'] and item['title'] not in seen:
                    seen.add(item['title'])
                    items.append(item)
        except Exception:
            pass
    return items


def fetch_news_rss():
    items, seen = [], set()
    for source, url in RSS_FEEDS:
        try:
            feed = feedparser.parse(url)
            for entry in (feed.entries or [])[:6]:
                title = entry.get('title', '').strip()
                if not title or title in seen:
                    continue
                seen.add(title)
                summary = entry.get('summary', entry.get('description', ''))
                summary = re.sub(r'<[^>]+>', ' ', summary).strip()[:300]
                link = entry.get('link', '#')
                pub  = entry.get('published', '')[:16]
                items.append({'title': title, 'summary': summary,
                               'publisher': source, 'link': link, 'time': pub})
        except Exception:
            pass
    return items


def translate_to_zh(text):
    if not text or not text.strip():
        return text
    try:
        r = requests.get(
            'https://api.mymemory.translated.net/get',
            params={'q': text[:480], 'langpair': 'en|zh-TW'},
            timeout=8,
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        if r.status_code == 200:
            data = r.json()
            if data.get('responseStatus') == 200:
                translated = data['responseData']['translatedText']
                if 'QUERY LENGTH LIMIT' not in translated:
                    return translated
    except Exception:
        pass
    return text


def summarize_with_deepseek(items, api_key):
    if not api_key:
        return None
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key, base_url='https://api.deepseek.com')
        news_text = '\n'.join(
            f'{i+1}. 標題：{n["title"]}\n   摘要：{n["summary"][:200]}'
            for i, n in enumerate(items)
        )
        prompt = (
            '你是專業財經分析師。以下是英文財經新聞，請逐一處理，為每則新聞輸出：\n'
            '  - title：中文標題翻譯（20字以內，精準）\n'
            '  - summary：中文市場分析（30-45字，說明對市場的影響）\n'
            '  - impact：影響程度（high/mid/low）\n'
            '  - sentiment：市場方向（bull/bear/neutral）\n'
            '  - region：影響範圍（美國/全球/亞洲）\n\n'
            f'新聞：\n{news_text}\n\n'
            '僅返回 JSON 陣列，格式：\n'
            '[{"title":"...","summary":"...","impact":"high","sentiment":"bull","region":"全球"}, ...]'
        )
        resp = client.chat.completions.create(
            model='deepseek-chat',
            max_tokens=2500,
            messages=[{'role': 'user', 'content': prompt}]
        )
        raw = resp.choices[0].message.content.strip()
        m = re.search(r'\[.*\]', raw, re.DOTALL)
        return json.loads(m.group() if m else raw)
    except Exception as e:
        print(f'    DeepSeek API error: {e}')
        return None


def fetch_and_process_news():
    print('    Fetching Yahoo Finance news...')
    yf_news = fetch_news_yfinance()
    print(f'    Yahoo Finance: {len(yf_news)} items')

    print('    Fetching RSS feeds...')
    rss_news = fetch_news_rss()
    print(f'    RSS feeds: {len(rss_news)} items')

    seen, all_items = set(), []
    for n in yf_news + rss_news:
        if n['title'] and n['title'] not in seen:
            seen.add(n['title'])
            all_items.append(n)

    for item in all_items:
        item.update(classify_news(item['title'], item.get('summary', '')))

    impact_order = {'high': 0, 'mid': 1, 'low': 2}
    all_items.sort(key=lambda x: (impact_order.get(x.get('impact', 'low'), 2),
                                  -len(x.get('summary', ''))))
    all_items = all_items[:10]

    api_key = os.environ.get('DEEPSEEK_API_KEY', '')
    print('    Trying DeepSeek AI analysis...')
    ai_results = summarize_with_deepseek(all_items, api_key)

    if ai_results:
        print(f'    [OK] DeepSeek AI done ({len(ai_results)} items)')
        for i, item in enumerate(all_items):
            if i < len(ai_results):
                cr = ai_results[i]
                item['zh_title']   = cr.get('title', '')
                item['zh_summary'] = cr.get('summary', '')
                item['impact']     = cr.get('impact', item['impact'])
                item['sentiment']  = cr.get('sentiment', item['sentiment'])
                item['region']     = cr.get('region', item.get('region', '美國'))
    else:
        print('    [OK] Using free translation (MyMemory)...')
        for i, item in enumerate(all_items):
            print(f'      Translating {i+1}/{len(all_items)}: {item["title"][:40]}...')
            item['zh_title'] = translate_to_zh(item['title'])
            if item.get('summary'):
                item['zh_summary'] = translate_to_zh(item['summary'][:150])

    return all_items


# ============================================================
# HOT STOCKS
# ============================================================

def screen_hot_stocks(cache):
    buy_list, sell_list = [], []
    for sym, name in US_WATCHLIST:
        df = cache.get(sym)
        if df is None or df.empty or len(df) < 22:
            continue
        try:
            df2  = df[df['Close'].notna()]
            avg  = float(df2['Volume'].tail(21).iloc[:-1].mean())
            if avg == 0:
                continue
            vr   = float(df2['Volume'].iloc[-1]) / avg
            cur  = float(df2['Close'].iloc[-1])
            prev = float(df2['Close'].iloc[-2])
            pct  = (cur / prev - 1) * 100
            item = {'name': name, 'symbol': sym, 'price': round(cur, 2),
                    'changePercent': round(pct, 2), 'volumeRatio': round(vr, 2)}
            if pct > 0 and vr >= 1.5:
                buy_list.append(item)
            elif pct < 0 and vr >= 2.5:
                sell_list.append(item)
        except Exception:
            pass
    buy_list.sort(key=lambda x: x['changePercent'], reverse=True)
    sell_list.sort(key=lambda x: x['changePercent'])
    return buy_list[:6], sell_list[:6]


# ============================================================
# ECONOMIC CYCLE
# ============================================================

def determine_cycle(tnx_df, fvx_df, tip_df, ief_df):
    try:
        spread    = (tnx_df['Close'] - fvx_df['Close']).dropna()
        sma       = spread.rolling(20).mean().dropna()
        growth_up = bool(sma.iloc[-1] > sma.iloc[-10]) if len(sma) >= 10 else True
        ratio     = (tip_df['Close'] / ief_df['Close']).dropna()
        rma       = ratio.rolling(20).mean().dropna()
        infl_up   = bool(rma.iloc[-1] > rma.iloc[-10]) if len(rma) >= 10 else True
        table = {
            (True, True):   ('overheating', '過熱期'),
            (True, False):  ('recovery',    '復甦期'),
            (False, True):  ('stagflation', '滯脹期（Stagflation）'),
            (False, False): ('recession',   '衰退期'),
        }
        key, zh = table[(growth_up, infl_up)]
        return {
            'phase': key, 'phaseZh': zh,
            'growthDirection': 'up' if growth_up else 'down',
            'inflationDirection': 'up' if infl_up else 'down',
            'spread': float(tnx_df['Close'].iloc[-1] - fvx_df['Close'].iloc[-1]),
        }
    except Exception:
        return {
            'phase': 'recession', 'phaseZh': '無法判斷',
            'growthDirection': 'down', 'inflationDirection': 'down',
            'spread': 0.0,
        }


# ============================================================
# VIX LABEL
# ============================================================

def vix_label(val):
    if val is None:
        return '無數據'
    if val < 12:   return '極低波動'
    if val < 16:   return '低波動'
    if val < 20:   return '中波動'
    if val < 25:   return '中高波動'
    if val < 30:   return '高波動'
    return '極高波動'


# ============================================================
# MAIN COLLECT & BUILD
# ============================================================

def collect_all_data():
    """Fetch all market data and return raw dict."""
    print('[1/6] Downloading main market data...')
    main_syms = list(set(
        [s for s, _ in HERO_TICKERS] +
        [s for s, _ in ASIAN_INDICES] + [s for s, _ in EMERGING_INDICES] +
        [s for s, _ in EUROPEAN_INDICES] + [s for s, _ in US_INDICES] +
        [s for s, *_ in COMMODITIES] + [s for s, _ in FOREX] +
        [s for s, *_ in BONDS] + [s for s, *_ in CRYPTO] +
        ['TIP', 'IEF', '^VIX']
    ))
    cache = bulk_download(main_syms, 400)

    print('[2/6] Downloading ETF flow data...')
    cache.update(bulk_download(
        [s for s, _ in COUNTRY_ETFS + SECTOR_ETFS + BOND_ETFS], 400))

    print('[3/6] Downloading hot stocks data...')
    cache.update(bulk_download([s for s, _ in US_WATCHLIST], 60))

    print('[4/6] Computing indicators...')
    q = lambda s: get_quote(s, cache)

    # Fear & Greed
    print('[5/6] Fetching sentiment & news...')
    fg = fetch_fear_greed()

    # VIX
    vix_q = q('^VIX')
    vix_val = safe_float(vix_q['price']) if vix_q else 0.0

    # 10Y yield
    tnx_q = q('^TNX')
    tnx_val = safe_float(tnx_q['price']) if tnx_q else 0.0

    # Dollar index
    dxy_q = q('DX-Y.NYB')
    dxy_val = safe_float(dxy_q['price']) if dxy_q else 0.0

    # 5Y yield for spread
    fvx_q = q('^FVX')
    fvx_val = safe_float(fvx_q['price']) if fvx_q else 0.0

    # Cycle
    cycle = determine_cycle(
        cache.get('^TNX', pd.DataFrame()), cache.get('^FVX', pd.DataFrame()),
        cache.get('TIP', pd.DataFrame()), cache.get('IEF', pd.DataFrame()),
    )

    # Hot stocks
    buy_stocks, sell_stocks = screen_hot_stocks(cache)

    print('[6/6] Processing news...')
    news_items = fetch_and_process_news()

    return {
        'cache': cache, 'q': q, 'fg': fg,
        'vix_val': vix_val, 'tnx_val': tnx_val, 'dxy_val': dxy_val,
        'fvx_val': fvx_val, 'cycle': cycle,
        'buy_stocks': buy_stocks, 'sell_stocks': sell_stocks,
        'news_items': news_items,
    }


def build_report_json(raw):
    """Transform raw data into the ReportData JSON structure."""
    cache = raw['cache']
    q = raw['q']

    # --- Hero Indicators ---
    hero_indicators = []
    for sym, name in HERO_TICKERS:
        quote = q(sym)
        sparkline = get_sparkline(sym, cache, 30)
        if quote:
            hero_indicators.append({
                'name': name,
                'value': round(safe_float(quote['price']), 2),
                'change': round(safe_float(quote['chg']), 2),
                'changePercent': round(safe_float(quote['pct']), 2),
                'sparklineData': sparkline,
            })
        else:
            hero_indicators.append({
                'name': name, 'value': 0, 'change': 0,
                'changePercent': 0, 'sparklineData': sparkline,
            })

    # --- Market Regions ---
    def build_region(name, tickers):
        indices = []
        for sym, idx_name in tickers:
            quote = q(sym)
            if quote:
                indices.append({
                    'name': idx_name,
                    'close': round(safe_float(quote['price']), 2),
                    'change': round(safe_float(quote['chg']), 2),
                    'changePercent': round(safe_float(quote['pct']), 2),
                    'trend': arrow_trend(quote['pct']),
                    'ytd': round(safe_float(quote['ytd']), 2),
                })
            else:
                indices.append({
                    'name': idx_name, 'close': 0, 'change': 0,
                    'changePercent': 0, 'trend': 'neutral', 'ytd': 0,
                })
        return {'region': name, 'indices': indices}

    market_regions = [
        build_region('亞洲', ASIAN_INDICES),
        build_region('新興市場', EMERGING_INDICES),
        build_region('歐洲', EUROPEAN_INDICES),
        build_region('美國', US_INDICES),
    ]

    # --- News ---
    news = []
    for item in raw['news_items']:
        news.append({
            'impact': item.get('impact', 'low'),
            'sentiment': item.get('sentiment', 'neutral'),
            'region': item.get('region', '美國'),
            'titleZh': item.get('zh_title', item.get('title', '')),
            'titleEn': item.get('title', ''),
            'summary': item.get('zh_summary', item.get('summary', '')),
            'source': item.get('publisher', ''),
            'time': item.get('time', ''),
            'url': item.get('link', '#'),
        })

    # --- Commodities ---
    commodities = []
    for sym, name, *_ in COMMODITIES:
        quote = q(sym)
        if quote:
            commodities.append({
                'name': name,
                'price': round(safe_float(quote['price']), 2),
                'change': round(safe_float(quote['chg']), 2),
                'changePercent': round(safe_float(quote['pct']), 2),
                'trend': arrow_trend(quote['pct']),
            })
        else:
            commodities.append({
                'name': name, 'price': 0, 'change': 0,
                'changePercent': 0, 'trend': 'neutral',
            })

    # --- Forex ---
    forex = []
    for sym, name in FOREX:
        quote = q(sym)
        if quote:
            forex.append({
                'name': name,
                'rate': round(safe_float(quote['price']), 4),
                'change': round(safe_float(quote['chg']), 4),
                'changePercent': round(safe_float(quote['pct']), 2),
                'trend': arrow_trend(quote['pct']),
            })
        else:
            forex.append({
                'name': name, 'rate': 0, 'change': 0,
                'changePercent': 0, 'trend': 'neutral',
            })

    # --- Bonds ---
    bonds = []
    for sym, name, yr in BONDS:
        quote = q(sym)
        if quote:
            bonds.append({
                'name': name,
                'yield': round(safe_float(quote['price']), 3),
                'change': round(safe_float(quote['chg']), 3),
                'changePercent': round(safe_float(quote['pct']), 2),
                'trend': arrow_trend(quote['pct']),
            })
        else:
            bonds.append({
                'name': name, 'yield': 0, 'change': 0,
                'changePercent': 0, 'trend': 'neutral',
            })

    # --- Sentiment ---
    sentiment = {
        'fearGreed': raw['fg'],
        'vix': {
            'value': round(raw['vix_val'], 2),
            'label': vix_label(raw['vix_val']),
        },
        'tenYearYield': round(raw['tnx_val'], 3),
        'dollarIndex': round(raw['dxy_val'], 2),
        'yieldSpread': round(raw['tnx_val'] - raw['fvx_val'], 3),
        'economicCycle': {
            'phase': raw['cycle']['phase'],
            'phaseZh': raw['cycle']['phaseZh'],
            'growthDirection': raw['cycle']['growthDirection'],
            'inflationDirection': raw['cycle']['inflationDirection'],
        },
    }

    # --- Fund Flows ---
    def build_flows(etf_list):
        flows = []
        for sym, name in etf_list:
            flow = calc_etf_flow(sym, cache)
            if flow:
                flows.append({
                    'name': name,
                    'etf': sym,
                    'daily': fmt_flow(flow['daily']),
                    'weekly': fmt_flow(flow['weekly']),
                    'monthly': fmt_flow(flow['monthly']),
                    'ytd': fmt_flow(flow['ytd']),
                    'dailyDirection': flow_direction(flow['daily']),
                    'weeklyDirection': flow_direction(flow['weekly']),
                    'monthlyDirection': flow_direction(flow['monthly']),
                    'ytdDirection': flow_direction(flow['ytd']),
                })
            else:
                flows.append({
                    'name': name, 'etf': sym,
                    'daily': 'N/A', 'weekly': 'N/A',
                    'monthly': 'N/A', 'ytd': 'N/A',
                    'dailyDirection': 'up', 'weeklyDirection': 'up',
                    'monthlyDirection': 'up', 'ytdDirection': 'up',
                })
        return flows

    global_fund_flows = build_flows(COUNTRY_ETFS)
    sector_flows = build_flows(SECTOR_ETFS)
    bond_flows = build_flows(BOND_ETFS)

    # --- Crypto ---
    crypto = []
    for sym, name, tick in CRYPTO:
        quote = q(sym)
        if quote:
            crypto.append({
                'name': name,
                'symbol': tick,
                'price': round(safe_float(quote['price']), 2),
                'change': round(safe_float(quote['chg']), 2),
                'changePercent': round(safe_float(quote['pct']), 2),
                'trend': arrow_trend(quote['pct']),
            })
        else:
            crypto.append({
                'name': name, 'symbol': tick, 'price': 0,
                'change': 0, 'changePercent': 0, 'trend': 'neutral',
            })

    # --- Assemble ---
    report = {
        'date': TODAY_STR,
        'generatedAt': REPORT_TIME,
        'heroIndicators': hero_indicators,
        'marketRegions': market_regions,
        'news': news,
        'commodities': commodities,
        'forex': forex,
        'bonds': bonds,
        'sentiment': sentiment,
        'globalFundFlows': global_fund_flows,
        'sectorFlows': sector_flows,
        'bondFlows': bond_flows,
        'hotStocksInflow': raw['buy_stocks'],
        'hotStocksOutflow': raw['sell_stocks'],
        'crypto': crypto,
    }

    return report


# ============================================================
# MAIN
# ============================================================

def main():
    parser = argparse.ArgumentParser(description='Generate daily macro report JSON')
    parser.add_argument('--output', '-o', default=None,
                        help='Output file path (default: public/data/report.json)')
    args = parser.parse_args()

    output_path = args.output
    if not output_path:
        output_path = str(Path(__file__).parent.parent / 'public' / 'data' / 'report.json')

    print(f'=== Daily Macro Report Generator ===')
    print(f'Date: {TODAY_STR}')
    print(f'Output: {output_path}')
    print()

    raw = collect_all_data()
    report = build_report_json(raw)

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print()
    print(f'[DONE] Report saved to {output_path}')
    print(f'  Hero indicators: {len(report["heroIndicators"])}')
    print(f'  Market regions:  {len(report["marketRegions"])}')
    print(f'  News items:      {len(report["news"])}')
    print(f'  Commodities:     {len(report["commodities"])}')
    print(f'  Crypto:          {len(report["crypto"])}')


if __name__ == '__main__':
    main()
