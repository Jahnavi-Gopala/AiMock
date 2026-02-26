"use client"

import React from 'react'
import { Download, Save } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { resumeSchema } from '../../../lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveResume } from '../../../../actions/resume'
import useFetch from "@/hooks/use-fetch";


const ResumeBuilder = ({ initialContent }) => {
    const [activeTab, setActiveTab] = useState("edit");

    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
    }=useForm({
        resolver: zodResolver(resumeSchema),
        defaultValues: {
            contactInfo: {},
            summary: "",
            skills: "",
            experience: [],
            education: [],
            projects: [],
        },
    });

    const {
        loading: isSaving,
        fn: saveResumeFn,
        data: saveResult,
        error: saveError,
    }=useFetch(saveResume);

    return (
        <div>
            <div className='flex flex-col md:flex-row justify-between items-center gap-2'>
                <h1 className='font-bold gradient-title-animate text-5xl md:text-6xl'>
                    Resume Builder
                </h1>
                <div className='space-x-2'>
                    <Button variant='destructive'>
                        <Save className='h-4 w-4' />
                        Save
                    </Button>
                    <Button>
                        <Download className='h-4 w-4' />
                        Download
                    </Button>
                </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} >
                <TabsList>
                    <TabsTrigger value="edit">Form</TabsTrigger>
                    <TabsTrigger value="preview">Markdown</TabsTrigger>
                </TabsList>
                <TabsContent value="edit">Make changes to your account here.</TabsContent>
                <TabsContent value="preview">Change your password here.</TabsContent>
            </Tabs>
        </div>
    )
}

export default ResumeBuilder