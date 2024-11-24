import Layout from "@/components/Layout";

const ErrorPage = ({ message }: { message: string }) => {
  return (
    <Layout>
      <div className="w-full h-[55vh]">
        <code className="flex items-center justify-center h-full text-3xl font-bold">
          {message}
        </code>
      </div>
    </Layout>
  );
};

export default ErrorPage;
