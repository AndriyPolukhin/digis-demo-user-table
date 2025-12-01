import { render, screen, waitFor, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserTable } from '@/components/users/UserTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { User } from '@/lib/types/user';
import { useUserStore } from '@/lib/store/userStore';

// Mock users data
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'leanne@april.biz',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: { lat: '-37.3159', lng: '81.1496' },
    },
    phone: '1-770-736-8031',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets',
    },
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'ervin@melissa.tv',
    address: {
      street: 'Victor Plains',
      suite: 'Suite 879',
      city: 'Wisokyburgh',
      zipcode: '90566-7771',
      geo: { lat: '-43.9509', lng: '-34.4618' },
    },
    phone: '010-692-6593',
    website: 'anastasia.net',
    company: {
      name: 'Deckow-Crist',
      catchPhrase: 'Proactive didactic contingency',
      bs: 'synergize scalable supply-chains',
    },
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    username: 'Samantha',
    email: 'clementine@yesenia.net',
    address: {
      street: 'Douglas Extension',
      suite: 'Suite 847',
      city: 'McKenziehaven',
      zipcode: '59590-4157',
      geo: { lat: '-68.6102', lng: '-47.0653' },
    },
    phone: '1-463-123-4447',
    website: 'ramiro.info',
    company: {
      name: 'Romaguera-Jacobson',
      catchPhrase: 'Face to face bifurcated interface',
      bs: 'e-enable strategic applications',
    },
  },
];

// Create wrapper component with React Query provider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('UserTable Integration Tests', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset Zustand store
    act(() => {
      useUserStore.setState({
        users: [],
        filteredUsers: [],
        searchQuery: '',
        deletedUserIds: new Set(),
      });
    });
    
    // Reset fetch mock to successful response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockUsers,
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
  });

  describe('Initial Rendering', () => {
    it('should display loading state initially', () => {
      render(<UserTable />, { wrapper: createWrapper() });
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should display users in table after loading', async () => {
      render(<UserTable />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
        expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
        expect(screen.getByText('Clementine Bauch')).toBeInTheDocument();
      });
    });

    it('should display user details in correct columns', async () => {
      render(<UserTable />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('leanne@april.biz')).toBeInTheDocument();
        expect(screen.getByText('Romaguera-Crona')).toBeInTheDocument();
        expect(screen.getByText('Gwenborough')).toBeInTheDocument();
      });
    });

    it('should show correct user count', async () => {
      render(<UserTable />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Showing 3 users')).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('should filter users by name', async () => {
      const user = userEvent.setup();
      render(<UserTable />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search by name or email/i);
      await user.type(searchInput, 'Leanne');

      // Wait for debounce
      await waitFor(
        () => {
          expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
          expect(screen.queryByText('Ervin Howell')).not.toBeInTheDocument();
          expect(screen.queryByText('Clementine Bauch')).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    it('should filter users by email', async () => {
      const user = userEvent.setup();
      render(<UserTable />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search by name or email/i);
      await user.type(searchInput, 'melissa.tv');

      await waitFor(
        () => {
          expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
          expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    it('should be case-insensitive', async () => {
      const user = userEvent.setup();
      render(<UserTable />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search by name or email/i);
      await user.type(searchInput, 'LEANNE');

      await waitFor(
        () => {
          expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    it('should show empty state when no results found', async () => {
      const user = userEvent.setup();
      render(<UserTable />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search by name or email/i);
      await user.type(searchInput, 'nonexistent');

      await waitFor(
        () => {
          expect(screen.getByText('No users found')).toBeInTheDocument();
          expect(screen.getByText('Try adjusting your search terms')).toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    it('should clear search with clear button', async () => {
      const user = userEvent.setup();
      render(<UserTable />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search by name or email/i);
      await user.type(searchInput, 'Leanne');

      await waitFor(
        () => {
          expect(screen.queryByText('Ervin Howell')).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );

      // Find and click clear button within the search input
      const searchContainer = searchInput.parentElement;
      const clearButton = within(searchContainer!).getByRole('button');
      await user.click(clearButton);

      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
        expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
      });
    });
  });

  describe('Delete Functionality', () => {
    it('should open delete dialog when delete button clicked', async () => {
      const user = userEvent.setup();
      render(<UserTable />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      });

      // Find the row with Leanne Graham
      const leanneRow = screen.getByText('Leanne Graham').closest('tr');
      expect(leanneRow).toBeInTheDocument();

      // Click the delete button in that row
      const deleteButton = within(leanneRow!).getByRole('button');
      await user.click(deleteButton);

      // Dialog should appear
      await waitFor(() => {
        expect(screen.getByText(/are you absolutely sure/i)).toBeInTheDocument();
        // Leanne Graham appears twice: once in the table, once in the dialog
        const leanneElements = screen.getAllByText(/Leanne Graham/);
        expect(leanneElements.length).toBeGreaterThan(0);
      });
    });

    it('should cancel delete operation', async () => {
      const user = userEvent.setup();
      render(<UserTable />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      });

      const leanneRow = screen.getByText('Leanne Graham').closest('tr');
      const deleteButton = within(leanneRow!).getByRole('button');
      await user.click(deleteButton);

      // Wait for dialog
      await waitFor(() => {
        expect(screen.getByText(/are you absolutely sure/i)).toBeInTheDocument();
      });

      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      // User should still be there
      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      });
    });

    it('should delete user when confirmed', async () => {
      const user = userEvent.setup();
      render(<UserTable />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      });

      const leanneRow = screen.getByText('Leanne Graham').closest('tr');
      const deleteButton = within(leanneRow!).getByRole('button');
      await user.click(deleteButton);

      // Wait for dialog
      await waitFor(() => {
        expect(screen.getByText(/are you absolutely sure/i)).toBeInTheDocument();
      });

      // Click delete
      const confirmButtons = screen.getAllByRole('button', { name: /delete/i });
      const confirmButton = confirmButtons.find((btn) => 
        btn.classList.contains('bg-red-600')
      );
      await user.click(confirmButton!);

      // User should be removed
      await waitFor(() => {
        expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument();
        expect(screen.getByText('Showing 2 users')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error state when fetch fails', async () => {
      // Mock fetch to fail
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        })
      ) as jest.Mock;

      render(<UserTable />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Error loading users')).toBeInTheDocument();
      });
    });
  });
});
