import { Sparkle, Plus, Trash2, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useModel } from "@/contexts/modelContext"

type ChatInputButtonsProps = {
  onClear: () => void
  isInferenceActive: boolean
  onInferenceToggle: () => void
}

export function ChatInputButtons({
  onClear,
  isInferenceActive,
  onInferenceToggle,
}: ChatInputButtonsProps) {
  const { currentModel, setModel } = useModel();
  const models = ['deepseek-v3-241226', 'deepseek-r1-250120', 'doubao-1.5-lite-32k-250115'];

  const handleModelChange = () => {
    const currentIndex = models.indexOf(currentModel);
    const nextIndex = (currentIndex + 1) % models.length;
    setModel(models[nextIndex] as any);
  };

  return (
    <div className="flex items-center min-h-[60px] md:min-h-0 relative w-full md:w-[150px] lg:w-[200px] flex-shrink-0">
      {/* <Button type="button" variant="ghost" size="icon" className="absolute left-4">
        <Plus className="h-5 w-5" />
        <span className="sr-only">添加</span>
      </Button> */}

      <div className="flex gap-2 absolute left-1">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="rounded-full text-xs flex items-center px-2 py-1.5 hover:bg-gray-100/80"
          onClick={handleModelChange}
        >
          <Settings className="h-4 w-4" />
          <span className="hidden lg:inline ml-1">{currentModel}</span>
        </Button>
        {/* <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className={`rounded-full text-xs flex items-center px-2 py-1.5 ${isInferenceActive ? 'bg-gray-100/80' : 'hover:bg-gray-100/80'}`} 
          onClick={onInferenceToggle}
        >
          <Sparkle className="h-4 w-4" />
          <span className="hidden lg:inline ml-1">推理</span>
        </Button> */}
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="rounded-full text-xs flex items-center px-2 py-1.5 hover:bg-gray-100/80"
          onClick={onClear}
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden lg:inline ml-1">清除</span>
        </Button>
      </div>
    </div>
  )
}