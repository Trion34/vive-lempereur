interface LogEntryProps {
  type: string;
  text: string;
}

export function LogEntry({ type, text }: LogEntryProps) {
  const positiveClass = type === 'morale' && text.includes('+') ? ' positive' : '';
  const negativeClass = type === 'morale' && !text.includes('+') ? ' negative' : '';

  return (
    <div
      className={`log-entry ${type}${positiveClass}${negativeClass}`}
      dangerouslySetInnerHTML={{
        __html: text
          .split('\n\n')
          .map((p) => `<p>${p}</p>`)
          .join('\n\n'),
      }}
    />
  );
}
