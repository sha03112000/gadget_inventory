import { Smartphone } from 'lucide-react';
import { Button } from './ui/button';

type WelcomeScreenProps = {
  onGetStarted: () => void;
};

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="flex flex-col items-center space-y-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl flex items-center justify-center shadow-lg">
          <Smartphone className="w-12 h-12 text-white" strokeWidth={2} />
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-blue-600">Welcome to Mobile Hub</h1>
          <p className="text-gray-500">Your one-stop shop for mobile accessories</p>
        </div>

        <Button 
          onClick={onGetStarted}
          className="mt-8 px-12 rounded-full bg-blue-600 hover:bg-blue-700"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
