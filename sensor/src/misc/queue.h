#ifndef QUEUE_H
#define QUEUE_H

#include <queue>
#include <mutex>
#include <condition_variable>

template <typename T>
class Queue {
public:
    Queue() = default;
    ~Queue() = default;

    void enqueue(T value) {
        std::unique_lock<std::mutex> lock(mtx);
        queue.push(std::move(value));
        condVar.notify_one();
    }

    bool dequeue(T& value) {
        std::unique_lock<std::mutex> lock(mtx);
        if (queue.empty()) {
            return false;
        }
        value = std::move(queue.front());
        queue.pop();
        return true;
    }

    bool isEmpty() const {
        std::unique_lock<std::mutex> lock(mtx);
        return queue.empty();
    }

private:
    std::queue<T> queue;
    mutable std::mutex mtx;
    std::condition_variable condVar;
};

#endif // QUEUE_H
