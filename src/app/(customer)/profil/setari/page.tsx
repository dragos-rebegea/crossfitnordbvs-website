"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  accounts: { provider: string }[];
}

async function fetchProfile(): Promise<UserProfile> {
  const res = await fetch("/api/user/profile");
  if (!res.ok) throw new Error("Eroare la incarcarea profilului");
  return res.json();
}

async function updateProfile(
  data: Partial<{ name: string; phone: string; image: string }>
): Promise<UserProfile> {
  const res = await fetch("/api/user/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "Eroare la actualizare");
  }
  return res.json();
}

async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  const res = await fetch("/api/user/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || "Eroare la schimbarea parolei");
  }
}

export default function SetariPage() {
  const { update: updateSession } = useSession();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  // Profile form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [profileInitialized, setProfileInitialized] = useState(false);

  // Initialize form when profile loads
  if (profile && !profileInitialized) {
    setName(profile.name || "");
    setPhone(profile.phone || "");
    setImage(profile.image || "");
    setProfileInitialized(true);
  }

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      updateSession();
      toast.success("Profilul a fost actualizat");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Parola a fost schimbata cu succes");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileMutation.mutate({
      name: name.trim(),
      phone: phone.trim(),
      image: image.trim(),
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Parola noua trebuie sa aiba minim 8 caractere");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Parolele nu coincid");
      return;
    }

    passwordMutation.mutate({ currentPassword, newPassword });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  const connectedProviders = profile?.accounts.map((a) => a.provider) || [];

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold sm:text-3xl">
        <span className="text-grayText">SETARI </span>
        <span className="text-gold">CONT</span>
      </h1>

      {/* Edit profile */}
      <div className="rounded-xl bg-cardBg p-6">
        <h2 className="mb-4 text-lg font-bold text-white">
          Informatii personale
        </h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-grayText">
              Email
            </Label>
            <Input
              id="email"
              value={profile?.email || ""}
              disabled
              className="mt-1 border-gray-700 bg-darkBg text-grayText"
            />
          </div>
          <div>
            <Label htmlFor="name" className="text-grayText">
              Nume complet
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 border-gray-700 bg-darkBg text-white focus:border-gold"
              placeholder="Numele tau"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-grayText">
              Telefon
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 border-gray-700 bg-darkBg text-white focus:border-gold"
              placeholder="07xxxxxxxx"
            />
          </div>
          <div>
            <Label htmlFor="image" className="text-grayText">
              URL imagine profil
            </Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="mt-1 border-gray-700 bg-darkBg text-white focus:border-gold"
              placeholder="https://..."
            />
          </div>
          <Button
            type="submit"
            disabled={profileMutation.isPending}
            className="bg-gold text-darkBg hover:bg-goldHover"
          >
            {profileMutation.isPending ? "Se salveaza..." : "Salveaza modificarile"}
          </Button>
        </form>
      </div>

      {/* Change password */}
      <div className="rounded-xl bg-cardBg p-6">
        <h2 className="mb-4 text-lg font-bold text-white">Schimba parola</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword" className="text-grayText">
              Parola curenta
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 border-gray-700 bg-darkBg text-white focus:border-gold"
              required
            />
          </div>
          <div>
            <Label htmlFor="newPassword" className="text-grayText">
              Parola noua
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 border-gray-700 bg-darkBg text-white focus:border-gold"
              required
              minLength={8}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-grayText">
              Confirma parola noua
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 border-gray-700 bg-darkBg text-white focus:border-gold"
              required
              minLength={8}
            />
          </div>
          <Button
            type="submit"
            disabled={passwordMutation.isPending}
            className="bg-gold text-darkBg hover:bg-goldHover"
          >
            {passwordMutation.isPending
              ? "Se schimba..."
              : "Schimba parola"}
          </Button>
        </form>
      </div>

      {/* Connected accounts */}
      <div className="rounded-xl bg-cardBg p-6">
        <h2 className="mb-4 text-lg font-bold text-white">Conturi conectate</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-white">Google</span>
            </div>
            {connectedProviders.includes("google") ? (
              <Badge className="bg-green-600 text-white">Conectat</Badge>
            ) : (
              <Badge variant="outline" className="text-grayText">
                Neconectat
              </Badge>
            )}
          </div>

          <Separator className="bg-gray-700" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-white">Facebook</span>
            </div>
            {connectedProviders.includes("facebook") ? (
              <Badge className="bg-green-600 text-white">Conectat</Badge>
            ) : (
              <Badge variant="outline" className="text-grayText">
                Neconectat
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
