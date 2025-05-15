import React from 'react'
import { View, Text, ScrollView } from 'react-native'

interface Column {
  header: string
  key: string
}

export default function Table({
  columns = [],
  data = [],
}: {
  columns: Column[]
  data: Record<string, any>[]
}) {
  return (
    <ScrollView horizontal className="p-4">
      <View className="border border-gray-300 rounded-lg overflow-hidden w-full min-w-[300px]">
        <View className="flex-row bg-gray-200">
          {columns.map((col, idx) => (
            <Text
              key={idx}
              className="flex-1 text-center font-bold p-2 border-r border-gray-300"
            >
              {col.header}
            </Text>
          ))}
        </View>

        {data.map((row, rowIndex) => (
          <View
            key={rowIndex}
            className={`flex-row ${
              rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100'
            }`}
          >
            {columns.map((col, colIndex) => (
              <Text
                key={colIndex}
                className="flex-1 text-center p-2 border-r border-gray-200"
              >
                {row[col.key]}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
