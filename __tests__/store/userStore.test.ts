import { renderHook, act } from '@testing-library/react';
import { useUserStore } from '@/lib/store/userStore';
import { User } from '@/lib/types/user';

// Mock users data
const createMockUser = (id: number, name: string, email: string): User => ({
  id,
  name,
  username: `user${id}`,
  email,
  address: {
    street: 'Test Street',
    suite: 'Apt. 1',
    city: 'Test City',
    zipcode: '12345',
    geo: {
      lat: '0',
      lng: '0',
    },
  },
  phone: '123-456-7890',
  website: 'test.com',
  company: {
    name: 'Test Company',
    catchPhrase: 'Test phrase',
    bs: 'test bs',
  },
});

describe('userStore', () => {
  beforeEach(() => {
    // Reset store before each test - need to reset the singleton store properly
    const { result } = renderHook(() => useUserStore());
    act(() => {
      // Reset all store state including deletedUserIds
      useUserStore.setState({
        users: [],
        filteredUsers: [],
        searchQuery: '',
        deletedUserIds: new Set(),
      });
    });
  });

  describe('setUsers', () => {
    it('should set users and transform to table data', () => {
      const { result } = renderHook(() => useUserStore());

      const mockUsers = [
        createMockUser(1, 'John Doe', 'john@example.com'),
        createMockUser(2, 'Jane Smith', 'jane@example.com'),
      ];

      act(() => {
        result.current.setUsers(mockUsers);
      });

      expect(result.current.filteredUsers).toHaveLength(2);
      expect(result.current.filteredUsers[0].name).toBe('John Doe');
      expect(result.current.filteredUsers[0].email).toBe('john@example.com');
      expect(result.current.filteredUsers[0].companyName).toBe('Test Company');
      expect(result.current.filteredUsers[0].city).toBe('Test City');
    });
  });

  describe('setSearchQuery', () => {
    it('should filter users by name', () => {
      const { result } = renderHook(() => useUserStore());

      const mockUsers = [
        createMockUser(1, 'John Doe', 'john@example.com'),
        createMockUser(2, 'Jane Smith', 'jane@example.com'),
        createMockUser(3, 'Bob Johnson', 'bob@example.com'),
      ];

      act(() => {
        result.current.setUsers(mockUsers);
      });

      expect(result.current.filteredUsers).toHaveLength(3);

      act(() => {
        result.current.setSearchQuery('john');
      });

      expect(result.current.filteredUsers).toHaveLength(2);
      expect(result.current.filteredUsers[0].name).toBe('John Doe');
      expect(result.current.filteredUsers[1].name).toBe('Bob Johnson');
    });

    it('should filter users by email', () => {
      const { result } = renderHook(() => useUserStore());

      const mockUsers = [
        createMockUser(1, 'John Doe', 'john@example.com'),
        createMockUser(2, 'Jane Smith', 'jane@example.com'),
      ];

      act(() => {
        result.current.setUsers(mockUsers);
      });

      act(() => {
        result.current.setSearchQuery('jane@');
      });

      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].name).toBe('Jane Smith');
    });

    it('should be case-insensitive', () => {
      const { result } = renderHook(() => useUserStore());

      const mockUsers = [createMockUser(1, 'John Doe', 'john@example.com')];

      act(() => {
        result.current.setUsers(mockUsers);
      });

      act(() => {
        result.current.setSearchQuery('JOHN');
      });

      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].name).toBe('John Doe');
    });

    it('should return all users when search query is empty', () => {
      const { result } = renderHook(() => useUserStore());

      const mockUsers = [
        createMockUser(1, 'John Doe', 'john@example.com'),
        createMockUser(2, 'Jane Smith', 'jane@example.com'),
      ];

      act(() => {
        result.current.setUsers(mockUsers);
      });

      act(() => {
        result.current.setSearchQuery('john');
      });

      expect(result.current.filteredUsers).toHaveLength(1);

      act(() => {
        result.current.setSearchQuery('');
      });

      expect(result.current.filteredUsers).toHaveLength(2);
    });
  });

  describe('deleteUser', () => {
    it('should delete user optimistically', () => {
      const { result } = renderHook(() => useUserStore());

      const mockUsers = [
        createMockUser(1, 'John Doe', 'john@example.com'),
        createMockUser(2, 'Jane Smith', 'jane@example.com'),
      ];

      act(() => {
        result.current.setUsers(mockUsers);
      });

      expect(result.current.filteredUsers).toHaveLength(2);

      act(() => {
        result.current.deleteUser(1);
      });

      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].id).toBe(2);
      expect(result.current.filteredUsers[0].name).toBe('Jane Smith');
    });

    it('should maintain deleted user set', () => {
      const { result } = renderHook(() => useUserStore());

      const mockUsers = [
        createMockUser(1, 'John Doe', 'john@example.com'),
        createMockUser(2, 'Jane Smith', 'jane@example.com'),
      ];

      act(() => {
        result.current.setUsers(mockUsers);
      });

      act(() => {
        result.current.deleteUser(1);
      });

      // Try to add the same users again
      act(() => {
        result.current.setUsers(mockUsers);
      });

      // User 1 should still be deleted
      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].id).toBe(2);
    });

    it('should work with search filter', () => {
      const { result } = renderHook(() => useUserStore());

      const mockUsers = [
        createMockUser(1, 'John Doe', 'john@example.com'),
        createMockUser(2, 'Jane Smith', 'jane@example.com'),
        createMockUser(3, 'John Johnson', 'johnjohnson@example.com'),
      ];

      act(() => {
        result.current.setUsers(mockUsers);
      });

      act(() => {
        result.current.setSearchQuery('john');
      });

      expect(result.current.filteredUsers).toHaveLength(2);

      act(() => {
        result.current.deleteUser(1);
      });

      // Should still have 1 user matching "john"
      expect(result.current.filteredUsers).toHaveLength(1);
      expect(result.current.filteredUsers[0].id).toBe(3);
    });
  });
});
