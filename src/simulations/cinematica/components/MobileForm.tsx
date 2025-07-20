"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Trash2, Info } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ColorPicker } from "./ColorPicker"
import { Movil } from "../entities/Movil"
import { useSimulationStore } from "../store/useSimulationStore"

const FormSchema = z.object({
  position: z.object({
    x: z.number().int(),
    y: z.number().int(),
  }),
  velocity: z.object({
    x: z.number().int(),
    y: z.number().int(),
  }),
  acceleration: z.object({
    x: z.number().int(),
    y: z.number().int(),
  }),
  radius: z.number().int().positive(),
  color: z.string().min(1),
})

interface MobileFormProps {
  entity: Movil;
}

function MobileForm({ entity }: Readonly<MobileFormProps>) {
  const [fixedValues, setFixedValues] = useState<string[]>([])
  
  // Función para convertir decimales a enteros
  const fixToInteger = (value: number): number => {
    return Math.round(value)
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      position: {
        x: fixToInteger(entity.position.x),
        y: fixToInteger(entity.position.y),
      },
      velocity: {
        x: fixToInteger(entity.velocity.x),
        y: fixToInteger(entity.velocity.y),
      },
      acceleration: {
        x: fixToInteger(entity.acceleration.x),
        y: fixToInteger(entity.acceleration.y),
      },
      radius: fixToInteger(entity.radius),
      color: entity.color,
    },
  })

  const { updateEntity, deleteEntity } = useSimulationStore()

  // Auto-actualizar cuando cambian los valores
  const watchedValues = form.watch()
  
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (form.formState.isValid) {
        updateEntity(entity.id!, value as z.infer<typeof FormSchema>)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, entity.id!, updateEntity])

  const handleDelete = () => {
    deleteEntity(entity.id!)
    toast.success("Móvil eliminado", {
      description: `El móvil #${entity.id!} ha sido eliminado de la simulación`,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const form = e.currentTarget.form
      const formElements = Array.from(form?.elements || []) as HTMLElement[]
      const currentIndex = formElements.indexOf(e.currentTarget)
      const nextElement = formElements[currentIndex + 1] as HTMLInputElement
      
      if (nextElement && nextElement.type !== 'submit') {
        nextElement.focus()
      }
    }
  }

  const handleIntegerChange = (field: any, fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || value === '-') {
      field.onChange('')
      return
    }
    
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      const fixedValue = fixToInteger(numValue)
      
      // Si el valor fue modificado, mostrar hint
      if (numValue !== fixedValue) {
        setFixedValues(prev => [...prev.filter(f => f !== fieldName), fieldName])
        setTimeout(() => {
          setFixedValues(prev => prev.filter(f => f !== fieldName))
        }, 3000)
      }
      
      field.onChange(fixedValue)
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Móvil #{entity.id!}</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleDelete}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {fixedValues.length > 0 && (
        <Alert className="py-2">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Se redondearon valores decimales a enteros: {fixedValues.join(", ")}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form className="space-y-4">
          {/* Posición */}
          <div className="space-y-2">
            <FormLabel className="text-sm">Posición</FormLabel>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="position.x"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="0" 
                          value={field.value || ''}
                          onChange={handleIntegerChange(field, "posición X")}
                          onKeyDown={handleKeyDown}
                          className="pr-6 h-8 text-sm"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">X</span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position.y"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="0" 
                          value={field.value || ''}
                          onChange={handleIntegerChange(field, "posición Y")}
                          onKeyDown={handleKeyDown}
                          className="pr-6 h-8 text-sm"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Y</span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Velocidad */}
          <div className="space-y-2">
            <FormLabel className="text-sm">Velocidad</FormLabel>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="velocity.x"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="0" 
                          value={field.value || ''}
                          onChange={handleIntegerChange(field, "velocidad X")}
                          onKeyDown={handleKeyDown}
                          className="pr-6 h-8 text-sm"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">X</span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="velocity.y"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="0" 
                          value={field.value || ''}
                          onChange={handleIntegerChange(field, "velocidad Y")}
                          onKeyDown={handleKeyDown}
                          className="pr-6 h-8 text-sm"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Y</span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Aceleración */}
          <div className="space-y-2">
            <FormLabel className="text-sm">Aceleración</FormLabel>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="acceleration.x"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="0" 
                          value={field.value || ''}
                          onChange={handleIntegerChange(field, "aceleración X")}
                          onKeyDown={handleKeyDown}
                          className="pr-6 h-8 text-sm"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">X</span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="acceleration.y"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="0" 
                          value={field.value || ''}
                          onChange={handleIntegerChange(field, "aceleración Y")}
                          onKeyDown={handleKeyDown}
                          className="pr-6 h-8 text-sm"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Y</span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Radio y Color */}
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="radius"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-sm">Radio</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="10" 
                      value={field.value || ''}
                      onChange={handleIntegerChange(field, "radio")}
                      onKeyDown={handleKeyDown}
                      className="h-8 text-sm"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-sm">Color</FormLabel>
                  <FormControl>
                    <ColorPicker 
                      value={field.value} 
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  )
}

export default MobileForm