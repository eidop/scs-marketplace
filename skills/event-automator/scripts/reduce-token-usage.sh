#!/usr/bin/env bash
# -------------------------------------------------
# Reduce token‑usage limit when usage is 70‑90 %
# -------------------------------------------------

# Grab the current token‑usage percentage from `openclaw status`.
# (Adjust the grep/awk if the output format changes.)
usage=$(openclaw status 2>/dev/null \
        | grep -i "token usage" \
        | awk '{print $NF}' \
        | tr -d '%')

# Bail out if we can’t parse a number.
if [[ -z "$usage" ]]; then
  exit 0
fi

# If usage is in the 70‑90 % window, lower the limit to 10 %.
if (( usage >= 70 && usage <= 90 )); then
  # Patch the OpenClaw config – assumes a `tokenUsageLimit` field exists.
  openclaw config.patch '{"tokenUsageLimit":10}'
fi
