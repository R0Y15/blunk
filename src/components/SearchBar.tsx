import { zodResolver } from '@hookform/resolvers/zod'
import React, { Dispatch } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, SearchIcon } from 'lucide-react'

const formSchema = z.object({
  query: z.string().min(0).max(200),
})

const SearchBar = ({ query, setQuery }: { query: string, setQuery: Dispatch<React.SetStateAction<string>> }) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setQuery(values.query);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="gap-3 flex justify-center items-center">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Search File" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            size="sm"
            disabled={form.formState.isSubmitting}
            type="submit"
            className="flex gap-1"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="w-4 h-4 animate-spin" />
              // <p>Uploading...</p>
            )}
            <SearchIcon /> Search
          </Button>
        </form>
      </Form>
    </>
  )
}

export default SearchBar