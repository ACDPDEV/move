import { IconSearch, IconX } from "@tabler/icons-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function SearchInput({ input, setInput }: {
  input: string;
  setInput: (value: string) => void;
}) {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };

  const clearInput = () => {
    setInput("");
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
        <div className="relative flex items-center">
          <div className="absolute left-4 z-10">
            <IconSearch className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300" />
          </div>
          <Input
            type="text"
            placeholder="Buscar simuladores por nombre, descripción o área..."
            value={input}
            onChange={handleInput}
            className="w-full pl-12 pr-12 py-4 text-base bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-0 shadow-xl focus:shadow-2xl focus:bg-white/80 dark:focus:bg-slate-900/80 rounded-xl placeholder:text-slate-500 dark:placeholder:text-slate-400 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300"
          />
          {input && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearInput}
              className="absolute right-2 z-10 h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full group/clear"
            >
              <IconX className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover/clear:text-slate-600 dark:group-hover/clear:text-slate-300 transition-colors" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchInput;