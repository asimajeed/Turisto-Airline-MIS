import FormInput from "./FormInput";

const RegisterForm = ({
  firstName,
  lastName,
  email,
  password,
  setFirstName,
  setLastName,
  setEmail,
  setPassword,
  handleSignUp,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleSignUp: () => void;
}) => (
  <form>
    <FormInput
      label="First name"
      type="text"
      value={firstName}
      placeHolder="John"
      onChange={(e: any) => setFirstName(e.target.value)}
    />
    <FormInput
      label="Last name"
      type="text"
      value={lastName}
      placeHolder="Doe"
      onChange={(e: any) => setLastName(e.target.value)}
    />
    <FormInput
      label="Email"
      type="email"
      value={email}
      placeHolder="john.doe@abc.com"
      onChange={(e: any) => setEmail(e.target.value)}
    />
    <FormInput
      label="Password"
      type="password"
      value={password}
      onChange={(e: any) => setPassword(e.target.value)}
    />
    <label className="flex items-center mb-4 text-white">
      <input type="checkbox" className="mr-2" required />I have read and agree
      to the terms
    </label>
    <button
      className="w-full py-2 text-white bg-theme-primary-darker rounded font-semibold"
      onSubmit={handleSignUp}
    >
      Sign up
    </button>
  </form>
);

export default RegisterForm;
