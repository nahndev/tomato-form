const DocumentManagerHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div>
        <h1 className="text-2xl font-bold">Documents</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload, browse, and manage files stored on the server
        </p>
      </div>
    </div>
  );
};

export default DocumentManagerHeader;
