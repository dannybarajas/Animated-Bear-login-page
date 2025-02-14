import { useEffect, useState, useRef } from "react";

export default function App() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [hideBearImgs, setHideBearImgs] = useState<string[]>([]);
  const [watchBearImgs, setWatchBearImgs] = useState<string[]>([]);
  const [values, setValues] = useState({ email: '', password: '' });
  const [currentFocus, setCurrentFocus] = useState<"EMAIL" | "PASSWORD">("EMAIL");
  const [currentBearImg, setCurrentBearImg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadImages = (glob: Record<string, { default: string }>, setState: (imgs: string[]) => void) => {
      setState(
        Object.values(glob)
          .map((asset) => asset.default)
          .sort((a, b) =>
            (parseInt(a.match(/(\d+)-.*\.png$/)?.[1] || "0") - parseInt(b.match(/(\d+)-.*\.png$/)?.[1] || "0"))
          )
      );
    };

    loadImages(import.meta.glob("./assets/img/watch_bear_*.png", { eager: true }), setWatchBearImgs);
    loadImages(import.meta.glob("./assets/img/hide_bear_*.png", { eager: true }), setHideBearImgs);
  }, []);

  useEffect(() => {
    if (currentFocus === "EMAIL") {
      const index = Math.min(Math.floor(((values.email.length * 8) / 400) * watchBearImgs.length - 1), watchBearImgs.length - 1)
      setCurrentBearImg(watchBearImgs[index])
    } else if (currentFocus === "PASSWORD") {
      if (showPassword) {
        setCurrentBearImg(watchBearImgs[watchBearImgs.length - 1])
      } else {
        hideBearImgs.forEach((img, index) => setTimeout(() => setCurrentBearImg(img), index * 50));
      }
    }
  }, [currentFocus, hideBearImgs, watchBearImgs, values.email.length, showPassword])


  return (
    <main className="w-[400px] mx-auto min-h-dvh grid place-items-center">
      <form className="w-full flex flex-col items-center gap-4" onSubmit={(e) => {
        e.preventDefault()
        alert("Voilà~")
      }}>
        <img src={currentBearImg ?? watchBearImgs[0]} className="rounded-full" width={130} height={130} tabIndex={-1} />
        <input placeholder="Email" ref={emailRef} autoFocus onFocus={() => setCurrentFocus('EMAIL')} autoComplete="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
        <div className="relative w-full">
          <input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            onFocus={() => setCurrentFocus('PASSWORD')}
            ref={passwordRef}
            autoComplete="current-password"
            value={values.password}
            onChange={(e) => setValues({ ...values, password: e.target.value })}
            className="w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button className="py-4 w-full rounded-lg bg-tunnel-bear font-semibold text-lg focus:outline-tunnel-bear outline-offset-2">Log In</button>
      </form>
    </main>
  )
}

