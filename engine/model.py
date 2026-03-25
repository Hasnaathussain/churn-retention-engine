from __future__ import annotations

import os
from collections.abc import Iterable, Mapping, Sequence


class HeuristicChurnScorer:
    def __init__(self, model_path: str = "churn_model.json"):
        self.model_path = model_path
        self.is_trained = os.path.exists(self.model_path)

    def load_model(self) -> bool:
        return self.is_trained

    def train(self, historical_data: Sequence[Mapping[str, object]] | Iterable[Mapping[str, object]]):
        """
        Mock training function. In a real environment, this would fit an ML model.
        For the flagship rebuild, we keep the deterministic heuristic in place but
        persist a flag so the app can surface the trained state later.
        """
        if hasattr(historical_data, "__len__") and len(historical_data) == 0:  # type: ignore[arg-type]
            print("No data available to train.")
            return

        print("Training deterministic churn model...")

        with open(self.model_path, "w", encoding="utf-8") as file:
            file.write('{"status": "trained"}')
        self.is_trained = True
        print(f"Model saved to {self.model_path}")

    def score(self, customer_features: Mapping[str, object]) -> float:
        """
        Predict churn probability using a stable heuristic so the app remains useful
        even before a trained model is swapped in.
        """
        mrr = float(customer_features.get("mrr", 0) or 0)
        usage_frequency = int(customer_features.get("usage_frequency", 0) or 0)
        support_tickets = int(customer_features.get("support_tickets", 0) or 0)
        last_login_days_ago = int(customer_features.get("last_login_days_ago", 0) or 0)

        risk = 0.20

        if mrr < 50:
            risk += 0.10

        if usage_frequency < 5:
            risk += 0.30
        elif usage_frequency > 15:
            risk -= 0.15

        if support_tickets > 3:
            risk += 0.25

        if last_login_days_ago > 14:
            risk += 0.35
        elif last_login_days_ago < 3:
            risk -= 0.10

        return float(max(0.0, min(0.99, risk)))

    def predict(self, customer_features: Mapping[str, object]) -> float:
        return self.score(customer_features)


class ChurnPredictor(HeuristicChurnScorer):
    pass
