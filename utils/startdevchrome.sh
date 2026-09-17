#!/usr/bin/bash

# google-chrome --window-size=800,800  --new-window  "http://localhost:5500/" > /dev/null 2>&1 &
google-chrome-stable --window-name="WebDevHalf" --class="testGoogleWindow" --user-data-dir="$HOME/.config/google-chrome-test" "http://localhost:5500/" > /dev/null 2>&1 &
# sleep 1 && wmctrl -x -r "testGoogleWindow" -b add,above
google-chrome-stable --window-name="WebDevFull" --class="testGoogleFullWindow" --auto-open-devtools-for-tabs --user-data-dir="$HOME/.config/google-chrome-test-full" "http://localhost:5500/" > /dev/null 2>&1 &
