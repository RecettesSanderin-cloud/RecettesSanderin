// In a real app, this would interact with a backend that talks to the Stripe API.
export const processMockPayment = async (amount: number): Promise<{ success: boolean; transactionId?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 90% success rate, 10% failure
      const isSuccess = Math.random() > 0.1;
      resolve({
        success: true, // For demo purposes, we default to true mostly
        transactionId: isSuccess ? `txn_${Math.random().toString(36).substring(7)}` : undefined
      });
    }, 2000); // 2 second delay to simulate network request
  });
};