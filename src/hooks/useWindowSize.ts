export function useWindowSize() {
  const [state, setState] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
    isMobile: window.innerWidth < 640
  });

  useEffect(() => {
    const handler = () => {
      setState({
        winWidth: window.innerWidth,
        winHeight: window.innerHeight,
        isMobile: window.innerWidth < 640
      });
    };

    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  return state;
}
