export type ChatInputProps = {
  onSubmit: (message: string) => void
  onClear: () => void
  disabled?: boolean
}