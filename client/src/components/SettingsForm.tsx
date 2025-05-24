"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SettingsFormData, settingsSchema } from "@/lib/schemas";

import { Form } from "./ui/form";
import { CustomFormField } from "./FormField";
import { Button } from "./ui/button";

const SettingsForm = ({ initialData, onSubmit, userType }: SettingsFormProps) => {
    const [editMode, setEditMode] = useState(false);

    const form = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: initialData,
    });

    const toggleEditMode = () => {
        setEditMode((prevState) => !prevState);
        if (editMode) {
            form.reset(initialData);
        }
    };

    const handleSubmit = async (data: SettingsFormData) => {
        await onSubmit(data);
        setEditMode(false);
    };

    return (
        <div className='pt-8 pb-5 px-8'>
            <div className='mb-5'>
                <h1 className='text-xl font-semibold'>
                    {`${userType.charAt(0).toUpperCase() + userType.slice(1)} Settings`}
                </h1>
                <p className='text-sm text-gray-500 mt-1'>Manage your account preferences and personal information.</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6 bg-white p-6 rounded-lg'>
                    <CustomFormField name='name' label='Name' disabled={!editMode} />
                    <CustomFormField name='email' label='Email' type='email' disabled={!editMode} />
                    <CustomFormField name='phoneNumber' label='Phone Number' disabled={!editMode} />

                    <div className='pt-4 flex justify-between'>
                        <Button
                            type='button'
                            onClick={toggleEditMode}
                            className='bg-secondary-500 text-white hover:bg-secondary-600'
                        >
                            {editMode ? "Cancel" : "Edit"}
                        </Button>
                        {editMode && (
                            <Button type='submit' className='bg-primary-700 text-white hover:bg-primary-800'>
                                Save Changes
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default SettingsForm;
