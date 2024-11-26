declare module 'react-hot-toast' {
  export function toast(message: string): void;
  export function toast(options: { message: string; type: 'success' | 'error' }): void;
  export function success(message: string): void;
  export function error(message: string): void;
  export function loading(message: string): void;
  export function dismiss(): void;
  export function remove(toastId: string): void;
  export function promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ): Promise<T>;
  export function custom(jsx: JSX.Element): void;
  export function Toaster(props: any): JSX.Element;
} 