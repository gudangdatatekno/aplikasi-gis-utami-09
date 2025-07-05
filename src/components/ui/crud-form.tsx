
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'tel' | 'select' | 'textarea' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  step?: string;
}

interface CrudFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  fields: FormField[];
  title: string;
  description?: string;
  initialData?: any;
  mode: 'create' | 'edit';
  hideDialog?: boolean;
  wide?: boolean;
}

export const CrudForm: React.FC<CrudFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fields,
  title,
  description,
  initialData,
  mode,
  hideDialog = false,
  wide = false
}) => {
  // Create dynamic schema based on fields
  const createSchema = () => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};
    
    fields.forEach(field => {
      let fieldSchema: z.ZodTypeAny;
      
      switch (field.type) {
        case 'number':
          fieldSchema = z.number().or(z.string().transform(val => {
            const parsed = parseFloat(val);
            return isNaN(parsed) ? 0 : parsed;
          }));
          break;
        case 'email':
          fieldSchema = z.string().email();
          break;
        case 'date':
          fieldSchema = z.string();
          break;
        default:
          fieldSchema = z.string();
      }
      
      if (field.required) {
        if (field.type === 'number') {
          fieldSchema = fieldSchema;
        } else {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label} wajib diisi`);
        }
      } else {
        fieldSchema = fieldSchema.optional();
      }
      
      schemaFields[field.name] = fieldSchema;
    });
    
    return z.object(schemaFields);
  };

  const schema = createSchema();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {}
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (data: any) => {
    const processedData = { ...data };
    
    // Process number fields
    fields.forEach(field => {
      if (field.type === 'number' && processedData[field.name]) {
        processedData[field.name] = parseFloat(processedData[field.name]);
      }
    });
    
    onSubmit(processedData);
    form.reset();
    if (!hideDialog) {
      onClose();
    }
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'select':
        return (
          <Select
            onValueChange={(value) => form.setValue(field.name, value)}
            value={form.getValues(field.name) || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || `Pilih ${field.label}`} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'textarea':
        return (
          <Textarea
            {...form.register(field.name)}
            placeholder={field.placeholder}
            className="min-h-[100px] resize-y"
          />
        );
      
      case 'date':
        return (
          <Input
            {...form.register(field.name)}
            type="date"
            placeholder={field.placeholder}
          />
        );
      
      case 'number':
        return (
          <Input
            {...form.register(field.name)}
            type="number"
            step={field.step || "any"}
            placeholder={field.placeholder}
          />
        );
      
      default:
        return (
          <Input
            {...form.register(field.name)}
            type={field.type}
            placeholder={field.placeholder}
          />
        );
    }
  };

  const FormContent = () => (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className={`grid gap-6 ${wide ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {renderField(field)}
            {form.formState.errors[field.name] && (
              <p className="text-sm text-red-500">
                {form.formState.errors[field.name]?.message as string}
              </p>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-3 pt-6 border-t">
        {!hideDialog && (
          <Button type="button" variant="outline" onClick={() => { form.reset(); onClose(); }}>
            Batal
          </Button>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Menyimpan...' : (mode === 'edit' ? 'Perbarui' : 'Simpan')}
        </Button>
      </div>
    </form>
  );

  if (hideDialog) {
    return <FormContent />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${wide ? 'max-w-4xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          {description && <DialogDescription className="text-gray-600">{description}</DialogDescription>}
        </DialogHeader>
        <FormContent />
      </DialogContent>
    </Dialog>
  );
};
