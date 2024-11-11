import * as chrono from 'chrono-node';

export function parseInput(input: string) {
  const parsed = chrono.parse(input, new Date(), { forwardDate: true });
  
  if (!parsed.length) {
    throw new Error('Could not understand the date and time in your input. Please try again with a clearer description.');
  }

  const parsedDate = parsed[0];
  if (!parsedDate.start) {
    throw new Error('Could not determine when the event starts.');
  }

  const start = parsedDate.start.date();
  let end;
  
  if (parsedDate.end) {
    end = parsedDate.end.date();
  } else {
    // Default to 1 hour if no duration specified
    end = new Date(start.getTime() + 60 * 60 * 1000);
  }

  // Extract title from input by removing the date/time portion
  let title = input
    .replace(parsedDate.text, '')
    .trim()
    .replace(/^(for|at|on|in)\s+/, '')
    .trim();

  if (!title) {
    title = 'Untitled Event';
  }

  // Capitalize first letter of title
  title = title.charAt(0).toUpperCase() + title.slice(1);

  return {
    title,
    start,
    end,
    description: '',
    location: ''
  };
}