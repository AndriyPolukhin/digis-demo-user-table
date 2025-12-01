import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '@/components/users/SearchBar';
import { useUserStore } from '@/lib/store/userStore';

// Mock the store
jest.mock('@/lib/store/userStore');

describe('SearchBar Component', () => {
  const mockSetSearchQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock implementation
    (useUserStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        searchQuery: '',
        setSearchQuery: mockSetSearchQuery,
      };
      return selector ? selector(state) : state;
    });
  });

  it('should render search input', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/search by name or email/i)).toBeInTheDocument();
  });

  it('should display search icon', () => {
    render(<SearchBar />);
    const container = screen.getByPlaceholderText(/search by name or email/i).parentElement;
    expect(container?.querySelector('svg')).toBeInTheDocument();
  });

  it('should update input value on typing', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(/search by name or email/i);
    await user.type(input, 'John');

    expect(input).toHaveValue('John');
  });

  it('should debounce search query updates', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });

    render(<SearchBar />);

    const input = screen.getByPlaceholderText(/search by name or email/i);
    await user.type(input, 'John');

    // Should not call setSearchQuery immediately
    expect(mockSetSearchQuery).not.toHaveBeenCalled();

    // Fast-forward time past debounce delay
    jest.advanceTimersByTime(300);

    // Now it should be called
    await waitFor(() => {
      expect(mockSetSearchQuery).toHaveBeenCalledWith('John');
    });

    jest.useRealTimers();
  });

  it('should show clear button when input has value', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(/search by name or email/i);

    // Clear button should not be visible initially
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    await user.type(input, 'test');

    // Clear button should be visible
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should clear input when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(/search by name or email/i);
    await user.type(input, 'test');

    expect(input).toHaveValue('test');

    const clearButton = screen.getByRole('button');
    await user.click(clearButton);

    expect(input).toHaveValue('');
    expect(mockSetSearchQuery).toHaveBeenCalledWith('');
  });

  it('should sync with external store updates', () => {
    // Simulate store having a search query
    (useUserStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        searchQuery: 'external value',
        setSearchQuery: mockSetSearchQuery,
      };
      return selector ? selector(state) : state;
    });

    render(<SearchBar />);

    const input = screen.getByPlaceholderText(/search by name or email/i);
    expect(input).toHaveValue('external value');
  });

  it('should handle rapid typing correctly', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });

    render(<SearchBar />);

    const input = screen.getByPlaceholderText(/search by name or email/i);

    // Rapid typing
    await user.type(input, 'J');
    jest.advanceTimersByTime(100);
    await user.type(input, 'o');
    jest.advanceTimersByTime(100);
    await user.type(input, 'h');
    jest.advanceTimersByTime(100);
    await user.type(input, 'n');

    // Should not have called setSearchQuery yet
    expect(mockSetSearchQuery).not.toHaveBeenCalled();

    // Fast-forward past debounce
    jest.advanceTimersByTime(300);

    // Should only call once with final value
    await waitFor(() => {
      expect(mockSetSearchQuery).toHaveBeenCalledTimes(1);
      expect(mockSetSearchQuery).toHaveBeenCalledWith('John');
    });

    jest.useRealTimers();
  });
});
