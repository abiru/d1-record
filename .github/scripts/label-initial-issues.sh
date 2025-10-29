#!/usr/bin/env bash
# Label all d1-record initial issues for Codex
# Requires: GitHub CLI (gh)

set -e

echo "🧩 Labeling initial Codex issues..."
echo ""

# Define your repo (update if needed)
REPO="abiru/d1-record"

# Function to safely add label
label_issue() {
  local number=$1
  local label=$2
  echo "→ Labeling issue #$number with [$label]"
  gh issue edit "$number" --repo "$REPO" --add-label "$label"
}

# Label all issues
label_issue 1 "codex"
label_issue 1 "feature"

label_issue 2 "codex"
label_issue 2 "feature"

label_issue 3 "codex"
label_issue 3 "feature"

label_issue 4 "codex"
label_issue 4 "feature"

label_issue 5 "codex"
label_issue 5 "feature"

label_issue 6 "codex"
label_issue 6 "test"

label_issue 7 "codex"
label_issue 7 "docs"

echo ""
echo "✅ All issues have been labeled successfully!"
