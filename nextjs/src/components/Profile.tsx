'use client';
import { useLiff } from '@/components/LiffProvider';
import type { Profile } from '@liff/get-profile';
import { useState, useEffect } from 'react';

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { liff } = useLiff();

  useEffect(() => {
    if (liff?.isLoggedIn()) {
      (async () => {
        const profile = await liff.getProfile();
        setProfile(profile);
      })();
    }
  }, [liff]);

  const handleLogout = () => {
    liff?.logout();
    location.reload();
  };

  const handleLogin = () => {
    liff?.login();
  };

  return (
    <div>
      {profile && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.pictureUrl} alt="profile" />
          <p>userId: {profile.userId}</p>
          <p>displayName: {profile.displayName}</p>
        </>
      )}
      {profile ? (
        <button onClick={handleLogout}>logout</button>
      ) : (
        <button onClick={handleLogin}>login</button>
      )}
    </div>
  );
};

export default Profile;
