"use client"
import { useRouter } from "next/navigation"
import { LikeLogo } from "@/components/ui/logo/like-logo"
import Image from "next/image"
import { chatDB } from "@/lib/db/chatDb"
import { useChatContext } from "@/contexts/chatContext"
import { Button } from "@/components/ui/button"

export default function Page() {
  const router = useRouter();
  const { setMessages, setIsLoading, isLoading } = useChatContext();

  // 创建空会话
  const handleCreateEmptySession = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const sessionId = await chatDB.createSession();
      setMessages([]);
      router.push(`/chat/${sessionId}`);
    } catch (error) {
      console.error('创建会话失败:', error);
      setIsLoading(false);
    }
  };

  // 页面布局
  return (
    <>
      <div className="flex flex-col justify-center w-full h-3/4">
        <div className="flex flex-col gap-4 p-4 pt-0">
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <LikeLogo className="text-primary dark:text-primary-foreground" width={300} height={130} />
            <Image src="/next.svg" alt="Next.js icon" width={200} height={80} />
            <div className="flex gap-2">
              <div className="flex flex-col gap-4 items-center">
                <Button
                  variant="customOutline"
                  size="lg"
                  onClick={handleCreateEmptySession}
                  disabled={isLoading}
                  className="mt-8 w-40"
                >
                  新建对话
                </Button>
                <Button
                  variant="customOutline"
                  size="lg"
                  onClick={() => router.push('/liken-chat')}
                  disabled={isLoading}
                  className="w-40"
                >
                  临时对话
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}