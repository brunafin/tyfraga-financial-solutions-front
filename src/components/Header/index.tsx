import { useEffect, useState } from "react"
import LogoFull from "../../assets/logo-full.svg"
import { NavLink } from "react-router"
import Button from "../ui/Button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

const Header = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [showInstall, setShowInstall] = useState(false)

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault()
            setDeferredPrompt(event as BeforeInstallPromptEvent)
            setShowInstall(true)
        }

        const handleAppInstalled = () => {
            setDeferredPrompt(null)
            setShowInstall(false)
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
        window.addEventListener("appinstalled", handleAppInstalled)

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
            window.removeEventListener("appinstalled", handleAppInstalled)
        }
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return

        deferredPrompt.prompt()
        const choiceResult = await deferredPrompt.userChoice

        if (choiceResult.outcome === "accepted") {
            console.log("PWA instalado")
        }

        setDeferredPrompt(null)
        setShowInstall(false)
    }

    return (
        <header className={`${showInstall ? 'justify-between' : 'justify-center'} bg-white flex items-center h-[10vh] p-3`}>
            <NavLink to="/" className='flex items-center gap-2'>
                <img src={LogoFull} title="Logo Turcoin" alt="Logo Turcoin" />
            </NavLink>
            {showInstall && (
                <Button variant="outline_primary" className="text-sm" onClick={handleInstall}>
                    Instalar app
                </Button>
            )}
        </header>
    )
}

export default Header