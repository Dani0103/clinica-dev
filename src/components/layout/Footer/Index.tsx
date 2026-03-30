function Footer() {
  return (
    <footer className=" h-12 bg-black border-t-2 border-gray-500 flex items-center justify-between px-6 text-sm text-white">
      <span>© {new Date().getFullYear()} Clinica</span>
      <span> v 1.0</span>
    </footer>
  );
}

export default Footer;
