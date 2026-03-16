"use client";

import { useEffect, useState } from "react";
import { getMyProfile, MyProfile } from "@/services/profileService";

export function useProfile() {
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getInitials = (name: string) =>
    name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

  return { profile, loading, getInitials };
}