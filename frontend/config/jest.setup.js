// jest.setup.js
import '@testing-library/jest-dom';

// Mock Lucide icons globally
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="icon-search">SearchIcon</div>,
  Book: () => <div data-testid="icon-book">BookIcon</div>,
  CheckSquare: () => <div data-testid="icon-check-square">CheckSquareIcon</div>,
  RotateCcw: () => <div data-testid="icon-rotate-ccw">RotateCcwIcon</div>,
  ArrowRight: () => <div data-testid="icon-arrow-right">ArrowRightIcon</div>,
  Lightbulb: () => <div data-testid="icon-lightbulb">LightbulbIcon</div>,
  Award: () => <div data-testid="icon-award">AwardIcon</div>,
  Moon: () => <div data-testid="icon-moon">MoonIcon</div>,
  Sun: () => <div data-testid="icon-sun">SunIcon</div>,
  X: () => <div data-testid="icon-x">XIcon</div>,
  BookOpen: () => <div data-testid="icon-book-open">BookOpenIcon</div>
}));