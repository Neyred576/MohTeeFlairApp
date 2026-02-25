import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

import { CartProvider } from './src/context/CartContext';
import { AuthProvider } from './src/context/AuthContext';
import { WishlistProvider } from './src/context/WishlistContext';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <AppNavigator />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
