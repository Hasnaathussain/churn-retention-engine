import os

class ChurnPredictor:
    def __init__(self, model_path="churn_model.json"):
        self.model_path = model_path
        self.is_trained = os.path.exists(self.model_path)

    def load_model(self):
        return self.is_trained

    def train(self, historical_data_df):
        """
        Mock training function. In a real environment, this would train XGBoost.
        For this MVP, we save a flag to indicate the model is 'trained'.
        """
        if len(historical_data_df) == 0:
            print("No data available to train.")
            return

        print("Training deterministic churn model...")
        
        # Simulate saving the model
        with open(self.model_path, "w") as f:
            f.write('{"status": "trained"}')
        self.is_trained = True
        print(f"Model saved to {self.model_path}")

    def predict(self, customer_features: dict) -> float:
        """
        Predicts churn probability using a heuristic logic instead of XGBoost
        to ensure the app runs reliably without heavy C++ data science dependencies.
        """
        if not self.load_model():
            return 0.50
        
        mrr = customer_features.get('mrr', 0)
        usage_frequency = customer_features.get('usage_frequency', 0)
        support_tickets = customer_features.get('support_tickets', 0)
        last_login_days_ago = customer_features.get('last_login_days_ago', 0)
        
        # Base risk
        risk = 0.20
        
        # High MRR usually means more locked in, but if they churn it's worse.
        # We assume lower MRR might churn faster in SaaS
        if mrr < 50:
            risk += 0.10
            
        # Low usage is a big predictor
        if usage_frequency < 5:
            risk += 0.30
        elif usage_frequency > 15:
            risk -= 0.15
            
        # Too many support tickets indicates frustration
        if support_tickets > 3:
            risk += 0.25
            
        # Not logging in is the biggest predictor
        if last_login_days_ago > 14:
            risk += 0.35
        elif last_login_days_ago < 3:
            risk -= 0.10
            
        return float(max(0.0, min(0.99, risk)))
