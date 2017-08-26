# To set up development environment:
#   npm install -g browserify watchify
#   chmod +x dev.sh
#   ./dev.sh
#
# Assumes:
#   Source directory:   /src
#   Entry point:        /src/startup.js
watchify src/startup.js -o bundle.js --verbose --debug