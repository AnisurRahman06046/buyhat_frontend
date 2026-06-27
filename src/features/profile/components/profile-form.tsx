"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Spinner } from "@/components/shared/spinner";
import { TextField } from "@/components/shared/text-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { isApiError } from "@/services/http-error";

import { useProfile, useUpdateProfile } from "../hooks/use-profile";
import { profileSchema, type ProfileValues } from "../schemas/profile-schema";

export function ProfileForm() {
  const { data: profile, isLoading } = useProfile();
  const update = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      displayName: "",
      phone: "",
      marketingOptIn: false,
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        displayName: profile.displayName ?? "",
        phone: profile.phone ?? "",
        marketingOptIn: profile.marketingOptIn ?? false,
      });
    }
  }, [profile, reset]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-8" />
      </div>
    );
  }

  const error = update.isError && isApiError(update.error) ? update.error.message : null;
  const marketingOptIn = watch("marketingOptIn");

  const onSubmit = (values: ProfileValues) => {
    update.mutate({
      firstName: values.firstName || undefined,
      lastName: values.lastName || undefined,
      displayName: values.displayName || undefined,
      phone: values.phone || undefined,
      marketingOptIn: values.marketingOptIn,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4" noValidate>
      {error ? (
        <div
          role="alert"
          className="border-destructive/20 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm"
        >
          {error}
        </div>
      ) : null}

      {profile?.email ? (
        <div className="space-y-1.5">
          <Label htmlFor="profile-email">Email</Label>
          <Input id="profile-email" value={profile.email} disabled readOnly />
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <TextField
          label="First name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <TextField label="Last name" error={errors.lastName?.message} {...register("lastName")} />
      </div>

      <TextField
        label="Display name"
        error={errors.displayName?.message}
        {...register("displayName")}
      />
      <TextField
        label="Phone"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <div className="border-border flex items-center justify-between rounded-md border p-3">
        <div>
          <p className="text-foreground text-sm font-medium">Marketing emails</p>
          <p className="text-muted-foreground text-xs">Receive offers, news, and updates.</p>
        </div>
        <Switch
          checked={marketingOptIn}
          onCheckedChange={(v) => setValue("marketingOptIn", v, { shouldDirty: true })}
          aria-label="Marketing emails"
        />
      </div>

      <Button type="submit" disabled={update.isPending}>
        {update.isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
