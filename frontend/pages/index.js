import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to Forkin-Flavors!</h1>
      <p>This is our awesome landing page.</p>

      <Link href="/login">
        <button>Log In</button>
      </Link>
      <Link href="/signup">
        <button>Sign Up</button>
      </Link>
      
    </div>
  );
  }
  