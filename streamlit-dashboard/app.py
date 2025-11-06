"""
HyperNova Analytics - Live Streamlit Dashboard
Pulls data dynamically from Google Sheets
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from datetime import datetime
import os

# Page config
st.set_page_config(page_title="HyperNova Analytics", page_icon="🚀", layout="wide")

# DARK MODE CSS - Dark Background with Light Text
st.markdown("""
<style>
    /* Main background dark */
    .main { 
        background-color: #0e1117;
        color: #ffffff;
        padding: 0rem 1rem; 
    }
    
    /* Metrics cards */
    .stMetric { 
        background-color: #1e2130; 
        padding: 1.5rem; 
        border-radius: 0.75rem; 
        border: 2px solid #667eea;
    }
    .stMetric label {
        color: #ffffff !important;
        font-size: 1.2rem !important;
        font-weight: 700 !important;
    }
    .stMetric [data-testid="stMetricValue"] {
        color: #667eea !important;
        font-size: 2.5rem !important;
        font-weight: 900 !important;
    }
    
    /* Headings */
    h1, h2, h3, h4, h5, h6 { 
        color: #ffffff !important;
        font-weight: 700 !important;
    }
    h1 {
        color: #667eea !important;
        font-size: 3rem !important;
    }
    
    /* Tabs */
    .stTabs [data-baseweb="tab-list"] {
        background-color: #1e2130;
        border-radius: 8px;
        padding: 5px;
    }
    .stTabs [data-baseweb="tab"] {
        background-color: #262c3d;
        color: #ffffff !important;
        font-weight: 700;
        font-size: 1.1rem;
        border-radius: 6px;
        padding: 10px 20px;
    }
    .stTabs [aria-selected="true"] {
        background-color: #667eea !important;
        color: #ffffff !important;
    }
    
    /* All text light */
    p, div, span, label, li {
        color: #ffffff !important;
    }
    
    /* Sidebar dark */
    [data-testid="stSidebar"] {
        background-color: #1e2130;
    }
    [data-testid="stSidebar"] * {
        color: #ffffff !important;
    }
    
    /* Buttons */
    .stButton button {
        background-color: #667eea;
        color: #ffffff;
        font-weight: 700;
        border-radius: 8px;
        padding: 10px 24px;
        border: none;
    }
    .stButton button:hover {
        background-color: #5568d3;
    }
    
    /* DataFrames */
    .stDataFrame {
        background-color: #1e2130;
        border: 2px solid #667eea;
        border-radius: 8px;
    }
    .stDataFrame td, .stDataFrame th {
        color: #ffffff !important;
        background-color: #262c3d !important;
    }
    
    /* Charts background dark */
    .js-plotly-plot {
        background-color: #1e2130 !important;
    }
    
    /* Success/Error/Info boxes */
    .stAlert {
        background-color: #1e2130;
        color: #ffffff;
        border-left: 4px solid #667eea;
    }
    
    /* Spinner */
    .stSpinner > div {
        border-color: #667eea !important;
    }
</style>
""", unsafe_allow_html=True)

# Config
SPREADSHEET_ID = "1xm6UrKTqgDdB_8vdSrMMBotNbM4PNMwh-0hp63z3b2E"
SERVICE_ACCOUNT_FILE = os.path.join(os.path.dirname(__file__), "service-account.json")

# Dark theme for Plotly charts
plotly_dark_template = {
    'layout': {
        'paper_bgcolor': '#1e2130',
        'plot_bgcolor': '#262c3d',
        'font': {'color': '#ffffff', 'size': 14},
        'xaxis': {'gridcolor': '#404554', 'color': '#ffffff'},
        'yaxis': {'gridcolor': '#404554', 'color': '#ffffff'},
        'colorway': ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b']
    }
}

@st.cache_data(ttl=300)
def get_sheets_data(sheet_name):
    """Fetch data from Google Sheets"""
    try:
        if not os.path.exists(SERVICE_ACCOUNT_FILE):
            st.error(f"❌ Service account file not found: {SERVICE_ACCOUNT_FILE}")
            return pd.DataFrame()
            
        creds = Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE,
            scopes=['https://www.googleapis.com/auth/spreadsheets.readonly']
        )
        service = build('sheets', 'v4', credentials=creds)
        result = service.spreadsheets().values().get(
            spreadsheetId=SPREADSHEET_ID,
            range=f'{sheet_name}!A:Z'
        ).execute()
        values = result.get('values', [])
        if not values:
            st.warning(f"⚠️ No data in {sheet_name}")
            return pd.DataFrame()
        df = pd.DataFrame(values[1:], columns=values[0])
        st.success(f"✅ Loaded {len(df)} rows from {sheet_name}")
        return df
    except Exception as e:
        st.error(f"❌ Error loading {sheet_name}: {str(e)}")
        return pd.DataFrame()

# Header
col1, col2 = st.columns([2, 1])
with col1:
    st.title("🚀 HyperNova Analytics")
    st.markdown("### Real-time E-Commerce Monitoring")
with col2:
    if st.button("🔄 Refresh"):
        st.cache_data.clear()
        st.rerun()

st.markdown("---")

# Load data
with st.spinner("📊 Loading..."):
    df_api = get_sheets_data("APIRequests")
    df_errors = get_sheets_data("Errors")
    df_metrics = get_sheets_data("Metrics")

# Convert types
if not df_api.empty:
    df_api['Timestamp'] = pd.to_datetime(df_api['Timestamp'], errors='coerce')
    df_api['Duration'] = pd.to_numeric(df_api['Duration'], errors='coerce')
    df_api['StatusCode'] = pd.to_numeric(df_api['StatusCode'], errors='coerce')

if not df_errors.empty:
    df_errors['Timestamp'] = pd.to_datetime(df_errors['Timestamp'], errors='coerce')

if not df_metrics.empty:
    df_metrics['Timestamp'] = pd.to_datetime(df_metrics['Timestamp'], errors='coerce')
    df_metrics['Value'] = pd.to_numeric(df_metrics['Value'], errors='coerce')

# Key Metrics
st.header("📊 Key Metrics")
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("Total Requests", f"{len(df_api):,}")
with col2:
    st.metric("Total Errors", f"{len(df_errors):,}", delta=f"{len(df_errors)/max(len(df_api), 1)*100:.1f}%", delta_color="inverse")
with col3:
    avg_dur = df_api['Duration'].mean() if not df_api.empty else 0
    st.metric("Avg Response", f"{avg_dur:.2f}ms")
with col4:
    success = len(df_api[df_api['StatusCode'] == 200]) if not df_api.empty else 0
    st.metric("Success Rate", f"{success/max(len(df_api), 1)*100:.1f}%")

st.markdown("---")

# Tabs
tab1, tab2, tab3 = st.tabs(["📈 API Performance", "❌ Errors", "📊 Metrics"])

# Tab 1: API
with tab1:
    col1, col2 = st.columns(2)
    
    with col1:
        if not df_api.empty:
            st.subheader("📈 Requests Over Time")
            df_hourly = df_api.groupby(df_api['Timestamp'].dt.floor('H')).size().reset_index(name='count')
            fig = px.line(df_hourly, x='Timestamp', y='count', title='Hourly Requests',
                         template=plotly_dark_template)
            fig.update_traces(line_color='#667eea', line_width=3)
            fig.update_layout(**plotly_dark_template['layout'])
            st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        if not df_api.empty:
            st.subheader("🔵 By Method")
            method_counts = df_api['Method'].value_counts()
            fig = px.pie(values=method_counts.values, names=method_counts.index, 
                        title='HTTP Methods')
            fig.update_layout(**plotly_dark_template['layout'])
            st.plotly_chart(fig, use_container_width=True)
    
    if not df_api.empty:
        st.subheader("⏱️ Response Time")
        fig = px.histogram(df_api, x='Duration', nbins=30, title='Response Time Distribution')
        fig.update_layout(**plotly_dark_template['layout'])
        fig.update_traces(marker_color='#667eea')
        st.plotly_chart(fig, use_container_width=True)
        
        st.subheader("🐌 Slowest Endpoints")
        slowest = df_api.groupby('Path')['Duration'].mean().sort_values(ascending=False).head(10)
        fig = px.bar(x=slowest.values, y=slowest.index, orientation='h',
                    labels={'x': 'Avg Duration (ms)', 'y': 'Endpoint'},
                    title='Top 10 Slowest Endpoints',
                    color=slowest.values, color_continuous_scale='Reds')
        fig.update_layout(**plotly_dark_template['layout'])
        st.plotly_chart(fig, use_container_width=True)

# Tab 2: Errors
with tab2:
    if df_errors.empty:
        st.info("🎉 No errors!")
    else:
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("📉 Errors Over Time")
            df_err_hourly = df_errors.groupby(df_errors['Timestamp'].dt.floor('H')).size().reset_index(name='count')
            fig = px.area(df_err_hourly, x='Timestamp', y='count', title='Hourly Errors')
            fig.update_traces(line_color='#dc3545', fillcolor='rgba(220, 53, 69, 0.3)')
            fig.update_layout(**plotly_dark_template['layout'])
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            st.subheader("🔴 Error Types")
            error_types = df_errors['Type'].value_counts()
            fig = px.pie(values=error_types.values, names=error_types.index, 
                        title='Error Distribution')
            fig.update_layout(**plotly_dark_template['layout'])
            st.plotly_chart(fig, use_container_width=True)
        
        st.subheader("📋 Recent Errors")
        recent = df_errors.sort_values('Timestamp', ascending=False).head(20)
        st.dataframe(recent[['Timestamp', 'Type', 'Message', 'Endpoint']], 
                    use_container_width=True, hide_index=True)

# Tab 3: Metrics
with tab3:
    if df_metrics.empty:
        st.warning("⚠️ No metrics")
    else:
        metric_names = df_metrics['MetricName'].unique()
        selected = st.selectbox("Select Metric", metric_names)
        
        df_filtered = df_metrics[df_metrics['MetricName'] == selected]
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader(f"📊 {selected}")
            fig = px.line(df_filtered, x='Timestamp', y='Value', title=f'{selected} Timeline')
            fig.update_traces(line_color='#667eea', line_width=3)
            fig.update_layout(**plotly_dark_template['layout'])
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            st.subheader("📈 Stats")
            if not df_filtered.empty:
                st.metric("Current", f"{df_filtered['Value'].iloc[-1]:.2f}")
                st.metric("Average", f"{df_filtered['Value'].mean():.2f}")
                st.metric("Max", f"{df_filtered['Value'].max():.2f}")
                st.metric("Min", f"{df_filtered['Value'].min():.2f}")

# Footer
st.markdown("---")
st.markdown(f"""
<div style='text-align: center; color: #666;'>
    <p>🚀 HyperNova Analytics | Last updated: {datetime.now().strftime('%H:%M:%S')} | 
    Data auto-refreshes every 5 minutes</p>
</div>
""", unsafe_allow_html=True)
