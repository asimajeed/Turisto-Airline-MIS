import FormInput from './FormInput';

const RegisterFormBody = ({
  name,
  email,
  password,
  setName,
  setEmail,
  setPassword,
  handleSignUp,
}: {
  name: string;
  email: string;
  password: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleSignUp: () => void;
}) => (
  <>
    <FormInput label="Name" type="text" value={name} onChange={(e: any) => setName(e.target.value)} />
    <FormInput label="Email" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} />
    <FormInput label="Password" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} />
    <label className="flex items-center mb-4 text-white">
      <input type="checkbox" className="mr-2" required />
      I have read and agree to the terms
    </label>
    <button className="w-full py-2 text-white bg-slate-900 rounded font-semibold" onClick={handleSignUp}>
      Sign up
    </button>
  </>
);

export default RegisterFormBody;
