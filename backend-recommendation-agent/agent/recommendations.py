from typing import Dict, List

# Simple rule-based recommendations scaffold

def generate_recommendations(user_id: str, progress: Dict) -> List[Dict]:
    total = progress.get('total', 0)
    completed = progress.get('completed', 0)
    remaining = max(0, total - completed)
    recs = []
    if remaining == 0:
        recs.append({'type': 'congrats', 'message': 'All modules completed — consider advanced courses', 'priority': 10})
    else:
        recs.append({'type': 'continue', 'message': f'You have {remaining} modules left. Try a 25-minute focused session.', 'priority': 5})
        recs.append({'type': 'micro', 'message': 'Try a 10-minute review of the last module to reinforce memory.', 'priority': 4})
    return recs
