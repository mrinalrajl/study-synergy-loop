from typing import List, Tuple, Dict

# events: list of dicts with keys: event_type, duration, metadata
# We'll classify some event types as 'signal' and others as 'noise'

SIGNAL_TYPES = set(['focus_start', 'focus_tick', 'quiz_attempt', 'quiz_pass', 'video_play', 'note_write'])
NOISE_TYPES = set(['blur', 'tab_change', 'idle', 'notification', 'click_ads'])

# weights for types
TYPE_WEIGHTS = {
    'focus_start': 2.0,
    'focus_tick': 1.0,
    'quiz_attempt': 2.5,
    'quiz_pass': 3.0,
    'video_play': 1.5,
    'note_write': 1.2,
    'blur': 1.5,
    'tab_change': 1.2,
    'idle': 1.0,
    'notification': 1.1,
}


def compute_snr(events: List[dict]) -> Tuple[float, Dict[str, float]]:
    """Compute a simple SNR-like score from events. Returns (score, breakdown).

    score = (weighted_signal) / (1 + weighted_noise)
    We also normalize to 0-100.
    """
    signal = 0.0
    noise = 0.0
    total_signal_events = 0
    total_noise_events = 0

    for e in events:
        t = e.get('event_type')
        dur = float(e.get('duration') or 0.0)
        w = TYPE_WEIGHTS.get(t, 1.0)
        # duration boosts signal for focused events
        if t in SIGNAL_TYPES:
            signal += w * (1.0 + dur/30.0)
            total_signal_events += 1
        elif t in NOISE_TYPES:
            noise += w * (1.0 + dur/10.0)
            total_noise_events += 1
        else:
            # unknown event types: treat as small signal
            signal += 0.2 * (1.0 + dur/60.0)

    # compute ratio and map into 0-100
    raw = signal / (1.0 + noise)
    # apply scaling and clamp
    score = max(0.0, min(100.0, raw * 10.0))

    breakdown = {
        'signal_total': signal,
        'noise_total': noise,
        'signal_events': total_signal_events,
        'noise_events': total_noise_events,
    }
    return score, breakdown

# Simple test helper
if __name__ == '__main__':
    sample = [
        {'event_type':'focus_start','duration':60},
        {'event_type':'video_play','duration':120},
        {'event_type':'blur','duration':5},
        {'event_type':'tab_change','duration':2},
        {'event_type':'quiz_pass','duration':30},
    ]
    print(compute_snr(sample))
