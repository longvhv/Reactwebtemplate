/**
 * Usecase Table Component
 * 
 * Displays usecase information in a structured table format
 */

import { Usecase } from '../../data/usecases';
import { useLanguage } from '../../providers/LanguageProvider';

interface UsecaseTableProps {
  usecase: Usecase;
}

export function UsecaseTable({ usecase }: UsecaseTableProps) {
  const { t } = useLanguage();

  const renderListItems = (items: string[] | undefined) => {
    if (!items || items.length === 0) return '—';
    return (
      <ul className="list-none space-y-1 m-0">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm">- {item}</li>
        ))}
      </ul>
    );
  };

  const renderSteps = (steps: string[]) => {
    return (
      <ol className="list-none space-y-1 m-0">
        {steps.map((step, idx) => (
          <li key={idx} className="text-sm">{idx + 1}. {step}</li>
        ))}
      </ol>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-border">
        <tbody>
          {/* Use Case ID */}
          <tr>
            <td className="border border-border bg-muted/30 px-4 py-3 font-semibold w-[200px]">
              Use Case ID
            </td>
            <td className="border border-border px-4 py-3">
              {usecase.id}
            </td>
          </tr>

          {/* Tên Use Case */}
          <tr>
            <td className="border border-border bg-muted/30 px-4 py-3 font-semibold">
              Tên Use Case
            </td>
            <td className="border border-border px-4 py-3">
              {usecase.title}
            </td>
          </tr>

          {/* Tác nhân */}
          <tr>
            <td className="border border-border bg-muted/30 px-4 py-3 font-semibold">
              Tác nhân
            </td>
            <td className="border border-border px-4 py-3">
              {usecase.actor}
            </td>
          </tr>

          {/* Mô tả chức năng */}
          <tr>
            <td className="border border-border bg-muted/30 px-4 py-3 font-semibold">
              Mô tả chức năng
            </td>
            <td className="border border-border px-4 py-3">
              {usecase.description}
            </td>
          </tr>

          {/* Điều kiện tiên quyết */}
          <tr>
            <td className="border border-border bg-muted/30 px-4 py-3 font-semibold align-top">
              Điều kiện tiên quyết
            </td>
            <td className="border border-border px-4 py-3">
              {renderListItems(usecase.preconditions)}
            </td>
          </tr>

          {/* Yêu cầu */}
          <tr>
            <td className="border border-border bg-muted/30 px-4 py-3 font-semibold align-top">
              Yêu cầu
            </td>
            <td className="border border-border px-4 py-3">
              {renderListItems(usecase.requirements)}
            </td>
          </tr>

          {/* Kịch bản chính */}
          <tr>
            <td className="border border-border bg-muted/30 px-4 py-3 font-semibold align-top">
              Kịch bản chính
            </td>
            <td className="border border-border px-4 py-3">
              {renderSteps(usecase.steps)}
            </td>
          </tr>

          {/* Kịch bản phụ */}
          {usecase.alternativeFlows && usecase.alternativeFlows.length > 0 && (
            <tr>
              <td className="border border-border bg-muted/30 px-4 py-3 font-semibold align-top">
                Kịch bản phụ
              </td>
              <td className="border border-border px-4 py-3">
                {renderListItems(usecase.alternativeFlows)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
