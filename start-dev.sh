#!/bin/bash
# Start both backend and frontend for development

echo "🚀 Starting Trip Angkutan Development Server"
echo "============================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Start backend
echo -e "${YELLOW}Starting backend API on http://localhost:3000...${NC}"
cd backend && npm start &
BACKEND_PID=$!

# Wait for backend
sleep 2

# Check if backend is running
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend API running${NC}"
else
    echo -e "${YELLOW}⚠ Backend may still be starting...${NC}"
fi

# Start frontend
echo -e "${YELLOW}Starting frontend on http://localhost:5173...${NC}"
npm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}============================================="
echo "✓ Servers running:"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend:  http://localhost:3000/api"
echo ""
echo "Press Ctrl+C to stop"
echo "=============================================${NC}"

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Servers stopped'; exit" SIGINT SIGTERM
wait
