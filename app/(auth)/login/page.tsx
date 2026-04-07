"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signInSchema } from "@/lib/requestSchemas"
import Link from "next/link";
import { signInAction } from "../../actions/auth"
import { Spinner } from "@/components/ui/spinner"

export default function page() {
    const { formState: { isSubmitting }, ...form } = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof signInSchema>) {
        const result = await signInAction(data.email, data.password);

        if (!result.success) {
            toast.error("Failed to sign in");
        } else {
            window.location.href = "/";
        }
    }

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <Card className="w-full sm:max-w-md max-sm:border-0 max-sm:shadow-none">
                <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                    <CardDescription>
                        Sign in to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Email address
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your email"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your password"
                                            type="password"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field orientation="vertical">
                        <Button
                            type="submit"
                            className="cursor-pointer"
                            form="form-rhf-demo"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Spinner /> : "Submit"}
                        </Button>
                        <Button variant="link" asChild>
                            <Link href="/register">Don’t have an account? Register</Link>
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
        </div>
    )
}
