'use client';

// This component will render for routes like /aryanatrish, /johndoe, etc.
export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {username}!
      </h1>
      <p>This is your personalized dashboard. You can add more content here later.</p>
      {/* You could, for example, fetch and display this user's sessions here,
        similar to the 'My Sessions' page.
      */}
    </div>
  );
}
