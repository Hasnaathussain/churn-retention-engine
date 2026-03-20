import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")

class Database:
    def __init__(self):
        if SUPABASE_URL and SUPABASE_KEY and "xyz.supabase.co" not in SUPABASE_URL:
            self.client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        else:
            self.client = None
            print("Warning: Valid SUPABASE_URL or SUPABASE_KEY not set. Running in dummy mode.")

    def upsert_customer(self, customer_id: str, data: dict):
        if not self.client: return
        self.client.table("customers").upsert({"customer_id": customer_id, **data}).execute()

    def get_customer(self, customer_id: str):
        if not self.client: return None
        response = self.client.table("customers").select("*").eq("customer_id", customer_id).execute()
        if response.data:
            return response.data[0]
        return None

    def get_all_customers(self):
        if not self.client: return []
        response = self.client.table("customers").select("*").execute()
        return response.data

    def log_event(self, customer_id: str, event_type: str, metadata: dict = None):
        if not self.client: return
        self.client.table("events").insert({
            "customer_id": customer_id,
            "event_type": event_type,
            "metadata": metadata or {}
        }).execute()

db = Database()
