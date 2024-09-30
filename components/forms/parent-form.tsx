"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import InputField from "../input-field"; // Custom input component
import { parentSchema, ParentSchema } from "@/schemas/parent-schema"; // Add a schema for validation
import { createParent, updateParent } from "@/actions/parent-actions"; // Parent action
import Image from "next/image";
import { useFormState } from "react-dom";

const ParentForm = ({
    type,
    data,
    setOpen,
  }: {
    type: "create" | "update";
    data?: ParentSchema;
    setOpen: Dispatch<SetStateAction<boolean>>;
  }) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
    } = useForm<ParentSchema>({
      resolver: zodResolver(parentSchema),
      defaultValues: data,
    });
  
    const [state, formAction] = useFormState(
      type === "create" ? createParent : updateParent,
      { success: false, error: false }
    );
  
    const router = useRouter();
  
    const onSubmit = handleSubmit((formData) => {
      formAction(formData);
    });
  
    useEffect(() => {
      if (state.success) {
        toast(`Parent has been ${type === "create" ? "created" : "updated"}!`);
        setOpen(false);
        router.refresh();
      }
    }, [state, setOpen, router, type]);
  
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new parent" : "Update the parent"}
      </h1>

      <div className="flex gap-4 flex-wrap">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors?.password}
        />
        <InputField
          label="Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Surname"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors?.surname}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors?.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors?.address}
        />
      </div>

      <CldUploadWidget
        uploadPreset="ex-academy"
        onSuccess={(result: any) => {
          setValue('img', result.info.secure_url);
        }}
      >
        {({ open }) => (
          <div
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            onClick={() => open()}
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Upload a photo</span>
          </div>
        )}
      </CldUploadWidget>

      {state.error && <span className="text-red-500">Something went wrong!</span>}

      <button className="bg-blue-500 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ParentForm;
