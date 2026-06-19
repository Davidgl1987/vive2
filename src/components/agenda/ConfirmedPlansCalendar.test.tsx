import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  formatDateKeyMonthLabel,
  formatDateKeyWeekdayLabel,
  formatLongDate,
  getTodayDateInput,
} from '../../utils/format';
import { ConfirmedPlansCalendar } from './ConfirmedPlansCalendar';

describe('ConfirmedPlansCalendar', () => {
  it('shows an interactive calendar when there are no confirmed plans', () => {
    const onSelectDate = vi.fn();
    const today = getTodayDateInput();

    render(
      <ConfirmedPlansCalendar
        items={[]}
        selectedDate={null}
        onSelectDate={onSelectDate}
      />,
    );

    const todayButton = screen.getByRole('button', { name: formatLongDate(today) });
    expect(todayButton).toBeEnabled();
    expect(todayButton).toHaveTextContent(formatDateKeyMonthLabel(today));
    expect(todayButton).toHaveTextContent(formatDateKeyWeekdayLabel(today));

    fireEvent.click(todayButton);
    expect(onSelectDate).toHaveBeenCalledWith(today);
  });
});
