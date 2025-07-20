"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Movil } from "../entities/Movil"
import { useSimulationStore } from "../store/useSimulationStore"

const FormSchema = z.object({
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  velocity: z.object({
    x: z.number(),
    y: z.number(),
  }),
  acceleration: z.object({
    x: z.number(),
    y: z.number(),
  }),
  radius: z.number(),
  color: z.string(),
})

function MobileForm({entity}: Readonly<{
    entity: Movil;
}>) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      position: {
        x: entity.position.x,
        y: entity.position.y,
      },
      velocity: {
        x: entity.velocity.x,
        y: entity.velocity.y,
      },
      acceleration: {
        x: entity.acceleration.x,
        y: entity.acceleration.y,
      },
      radius: entity.radius,
      color: entity.color,
    },
  })

  const { updateEntity } = useSimulationStore()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    updateEntity(entity.id!, data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="position.x"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position X</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="position.y"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position Y</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="velocity.x"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Velocity X</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="velocity.y"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Velocity Y</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="acceleration.x"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acceleration X</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="acceleration.y"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acceleration Y</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="radius"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Radius</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> 
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default MobileForm